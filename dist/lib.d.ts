import { CustomError } from './custom-error';
import { configObjType } from './constants';
export { CustomError };
/**
 * @param {array} arg -- process.argv
 * @return {promise} resolve nothing
 */
export declare function processArg(argv: any): Promise<configObjType>;
/**
 * pass the `to` prop and switch over to that directory
 * @param {string} where to
 * @return {array} [ pkgFile, json ]
 */
export declare function changeAndGetPkg(where: string): any;
/**
 * copy over the properties
 * @param {object} pkg
 * @return {object}
 */
export declare function copyProps(pkg: any): any;
/**
 * just overwrite the existing package.json
 * @param {string} pkgFile path to package.json
 * @param {object} pkg content of the json
 * @return {promise} not throw error that means success
 */
export declare function overwritePkgJson(pkgFile: string, pkg: any): Promise<any>;
/**
 * Execute a npm install if they didn't supply the --noInstall
 * @param {object} args from command line
 * @return {promise}
 */
export declare function runInstall(args: any): Promise<any>;
/**
 * copy over the github / gitlab action
 * @param {object} args from cli
 * @return {promise} true on success
 */
export declare function installAction(args: any): Promise<configObjType>;
/**
 * To create some start-up template or not
 * 1. If skipTpl === true then no
 * 2. If they already have a ./src folder then no
 * @param {object} args
 * @return {Promise<configObjType>}
 */
export declare function setupTpl(args: any): Promise<configObjType>;
