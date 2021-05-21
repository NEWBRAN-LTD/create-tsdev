// just create a top level main function

import {
  processArg,
  changeAndGetPkg,
  copyProps,
  overwritePkgJson,
  runInstall,
  installAction
} from './lib'

/**
 * Top level API
 * @param {Object} _args from process.argv could use the type but it will be pointless 
 * @return {Promise<any>}
 * @public
 */
export async function main(_args: any): Promise<any> {
  // there is no point of accepting input anyway
  return processArg(_args)
    .then(args => {
      const [ pkgFile, _pkg ] = changeAndGetPkg(args.to || process.cwd())
      const pkg = copyProps(_pkg)

      return { args, pkg, pkgFile }
    })
    .then( ({ args, pkg, pkgFile }) => (
      overwritePkgJson(pkgFile, pkg)
        .then(() => args)
    ))
    // not ideal if the action fail then the next will not run
    .then(args => installAction(args))
    .then(args => runInstall(args))
}
