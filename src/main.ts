// main.ts
import fsx from 'fs-extra'
import { join } from 'path'
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
