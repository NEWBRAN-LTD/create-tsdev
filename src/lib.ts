// lib.ts libraries of functions
import { join, resolve, dirname } from 'path'
import {
  copy,
  ensureDir,
  existsSync,
  readJsonSync,
  writeJson
} from 'fs-extra'
import { CustomError } from './custom-error'
import {
  PLACEHOLDER,
  TARGET_KEYS,
  PKG_FILE,
  ACTION_NAME,
  ACTIONS,
  ACTION_MAP,
  YML_EXT,
  DEFAULT_OPTIONS,
  TPL_NAME,
  TEMPLATES
  configObjType
} from './constants'
import { execp, overwritePkgJson, checkExist } from './util'
import { createTemplate } from './template'
// re-export
export { CustomError }

/**
 * processing the command line input
 * @param {array} arg -- process.argv
 * @return {promise} resolve <configObjType>
 */
export async function processArg(argv: any): Promise<configObjType> {
  return Promise.resolve(argv)
    .then(args => {
      const keys = Object.keys(DEFAULT_OPTIONS)

      return keys
        .filter(key => {
          const check = argv[key] !== undefined
          // need to check this one
          if (check && key === ACTION_NAME) {
            const arg = args[key]
            switch (key) {
              case ACTION_NAME:
                return checkExist(ACTIONS, arg)
              case TPL_NAME:
                return checkExist(TEMPLATES, arg)
              default:
                return false
            }
          }

          return check
        })
        .map(key => ({ [key]: args[key] }))
        .reduce((a, b) => Object.assign(a, b), {})
    })
}

/**
 * pass the `to` prop and switch over to that directory
 * @param {string} where to
 * @return {array} [ pkgFile, json ]
 */
export function changeAndGetPkg(where: string): any {
  if (existsSync(where)) {
    process.chdir(where)
    const pkgFile = join(where, PKG_FILE)

    if (existsSync(pkgFile)) {
      // return a tuple instead
      return [
        pkgFile,
        readJsonSync(pkgFile)
      ]
    }
  }
  // just for f**king around with Typescript
  throw new CustomError(new TypeError(`${where} does not exist`))
}

/**
 * copy over the properties
 * @param {object} pkg
 * @return {object}
 */
export function copyProps(pkg: any): any {
  const pathToPkg = resolve(__dirname, '..', PKG_FILE)
  const myPkg = readJsonSync(pathToPkg)
  // first merge the Dependencies
  pkg.dependencies = Object.assign(pkg.dependencies || {}, myPkg.dependencies)
  pkg.devDependencies = Object.assign(pkg.devDependencies || {}, myPkg.devDependencies)
  // next add the ava options
  pkg.ava = myPkg.ava
  // finally add some of the scripts
  pkg.scripts = TARGET_KEYS.reduce((obj: any, key: string) => (
    Object.assign(obj, {[key]: myPkg.scripts[key]})
  ), pkg.scripts || {})

  return pkg
}



/**
 * Execute a npm install if they didn't supply the --noInstall
 * @param {object} args from command line
 * @return {promise}
 */
export function runInstall(args: any): Promise<any> {
  if (args.skipInstall !== true && process.env.NODE_ENV !== 'test') {

    return execp("npm install", process.cwd())
  }

  return Promise.resolve(true)
}

/**
 * copy over the github / gitlab action
 * @param {object} args from cli
 * @return {promise} true on success
 */
export async function installAction(args: any): Promise<configObjType> {
    const _act = args.action
    if (_act && _act !== PLACEHOLDER) {
      const ymlFile = join(__dirname, 'actions', [_act, YML_EXT].join('.'))
      const dest = join(process.cwd(), ACTION_MAP[_act])
      // stupid hack
      if (_act === 'github') {
        ensureDir(dirname(dest))
      }
      return copy(ymlFile, dest)
        .then(() => {
          console.log(`${_act} ${YML_EXT} install to ${dest}`)
          return args
        })
        .catch(err => {
          console.error(`Copy ${_act} ${YML_EXT} failed`, err)
        })
    }
    // noting to do, same question as below
    return args
}
