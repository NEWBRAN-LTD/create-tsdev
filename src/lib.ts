// lib.ts libraries of functions
import { join, resolve } from 'path'
import { exec } from 'child_process'
import fsx from 'fs-extra'
import { CustomError } from './custom-error'

// the main method
type configObj = {
  to?: string,
  skipInstall? : boolean
}
const PKG_FILE: string = 'package.json'

// re-export
export { CustomError }

/**
 * @param {array} arg -- process.argv
 * @return {promise} resolve nothing
 */
export async function processArg(argv: Array<string>): Promise<configObj> {
  return Promise.resolve(argv)
    .then(args => {
      return args.reduce((a: configObj, arg: string) => {
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
 * @return {array} [ pkgFile, json ]
 */
export function changeAndGetPkg(where: string): any {
  if (fsx.existsSync(where)) {
    process.chdir(where)
    const dir = process.cwd()
    const pkgFile = join(dir, PKG_FILE)
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

/**
 * just overwrite the existing package.json
 * @param {string} pkgFile path to package.json
 * @param {object} pkg content of the json
 * @return {promise} not throw error that means success
 */
export function overwritePkgJson(pkgFile: string, pkg: any): Promise<any> {
  return fsx.writeJson(pkgFile, pkg)
}

/**
 * Execute a npm install if they didn't supply the --noInstall
 * @param {object} args from command line
 * @return {promise}
 */
export function runInstall(args: any): Promise<any> {
  return new Promise((resolver, rejecter)  => {
    if (args.skipInstall !== true) {
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
      console.log(`All done nothing to do`)
      resolver(true)
    }
  })
}
