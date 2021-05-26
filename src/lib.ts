// lib.ts libraries of functions
import { join, resolve, dirname } from 'path'
import { exec } from 'child_process'
import fsx from 'fs-extra'
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
  configObjType
} from './constants'

// re-export
export { CustomError }

/**
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
            const find = ACTIONS.filter(a => a === args[key].toLowerCase())

            return find.length > 0
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
  if (fsx.existsSync(where)) {
    process.chdir(where)
    const pkgFile = join(where, PKG_FILE)

    if (fsx.existsSync(pkgFile)) {
      // return a tuple instead
      return [
        pkgFile,
        fsx.readJsonSync(pkgFile)
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
  const myPkg = fsx.readJsonSync(pathToPkg)
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
 * just overwrite the existing package.json
 * @param {string} pkgFile path to package.json
 * @param {object} pkg content of the json
 * @return {promise} not throw error that means success
 */
export function overwritePkgJson(pkgFile: string, pkg: any): Promise<any> {
  return fsx.writeJson(pkgFile, pkg, {spaces: 2})
}

/**
 * Execute a npm install if they didn't supply the --noInstall
 * @param {object} args from command line
 * @return {promise}
 */
export function runInstall(args: any): Promise<any> {
  return new Promise((resolver, rejecter)  => {
    if (args.skipInstall !== true && process.env.NODE_ENV !== 'test') {
      console.log(`running npm install ...`)
      exec("npm install",
           {cwd: process.cwd()},
         (error, stdout, stderr) => {
           if (error) {
             console.error(`ERROR:`, error)
             return rejecter(false)
           }
           console.log(`stdout`, stdout)
           if (stderr) {
             console.error(`stderr`, stderr)
           }
           resolver(true)
         })
    } else {
      resolver(true)
    }
  })
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
        fsx.ensureDir(dirname(dest))
      }

      return fsx.copy(ymlFile, dest)
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

/**
 * To create some start-up template or not
 * 1. If skipTpl === true then no
 * 2. If they already have a ./src folder then no
 * @param {object} args
 * @return {Promise<configObjType>}
 */
export async function setupTpl(args: any): Promise<configObjType> {
  const projectDir = process.cwd()
  const files = [
    [join(__dirname, '..', 'clean.js'), join(projectDir, 'clean.js')]
  ]
  if (args.skipTpl !== true) {
    const tplDir = join(__dirname, 'tpl')
    const srcDir = join(projectDir, 'src')
    if (!fsx.existsSync(srcDir)) {
      files.push(
        [join(tplDir, 'main.tpl'), join(projectDir, 'src' ,'main.ts')],
        [join(tplDir, 'main.test.tpl'), join(projectDir, 'tests', 'main.test.ts')]
      )
    }
  }

  return Promise.all(
    files.map(fileTodo => Reflect.apply(fsx.copy, null, fileTodo))
  )
  .then(() => args)
}

/*
// just for testing purpose
export async function dummyFn(): Promise<any> {
  return 'something'
}
*/
