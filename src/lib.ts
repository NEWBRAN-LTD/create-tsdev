// lib.ts libraries of functions
import fsx from 'fs-extra'
import { join, resolve } from 'path'
import { CustomError } from './custom-error'

// the main method
type configObj = {
  to?: String,
  skipInstall? : Boolean
}
const PKG_FILE: string = 'package.json'

// re-export
export { CustomError }

/**
 * @param {array} arg -- process.argv
 * @return {promise} resolve nothing
 */
export async function processArg(argv: Array<String>): Promise<configObj> {
  return Promise.resolve(argv.slice(2))
    .then(args => {
      return args.reduce((a: configObj, arg: String) => {
        if (a.to !== undefined) {
          a.to = arg
        }
        else if (arg.toLowerCase() === '--to') {
          a.to = '' // placeholder
        }
        else if (arg === '--skipInstall') {
          a.skipInstall = true
        }
        return a
      }, {})
    })
}

/**
 * pass the `to` prop and switch over to that directory
 * @param {string} where to
 * @return {*}
 */
export function changeAndGetPkg(where: string): any {
  if (fsx.existsSync(where)) {
    process.chdir(where)
    const dir = process.cwd()
    const pkgFile = join(dir, PKG_FILE)
    if (fsx.existsSync(pkgFile)) {
      return fsx.readJsonSync(pkgFile)
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
  // first merge the devDependencies
  pkg.devDependencies = Object.assign(pkg.devDependencies || {}, myPkg.devDependencies)
  // next add the ava options
  pkg.ava = myPkg.ava
  // finally add some of the scripts
  const keys = ["test", "lint", "build", "clean", "ts-node", "docs"]
  pkg.scripts = keys.reduce((obj: any, key: string) => (
    Object.assign(obj, {[key]: myPkg.scripts[key]})
  ), pkg.scripts || {})
  pkg.dependencies = Object.assign(pkg.dependencies || {}, myPkg.dependencies)

  return pkg
}
