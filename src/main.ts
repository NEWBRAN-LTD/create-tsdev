// just create a top level main function

import {
  processArg,
  changeAndGetPkg,
  copyProps,
  overwritePkgJson,
  runInstall
} from './lib'

/**
 * Top level API
 * @param {args} array from process.argv
 * @return {void}
 * @public
 */
export async function main() {
  // there is no point of accepting input anyway
  return processArg(process.argv.slice(2))
    .then(args => {
      const [ pkgFile, _pkg ] = changeAndGetPkg(args.to || process.cwd())
      const pkg = copyProps(_pkg)

      return { args, pkg, pkgFile }
    })
    .then(({ args, pkg, pkgFile }) => (
      overwritePkgJson(pkgFile, pkg)
        .then(() => runInstall(args))
    ))
}
