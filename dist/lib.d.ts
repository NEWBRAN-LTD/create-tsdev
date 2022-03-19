import { CustomError } from './custom-error';
import { configObjType } from './constants';
export { CustomError };
/**
 * get the --install option, and provide default value
 * @param {array} arg -- process.argv
 * @return {any} modified arg
 */
export declare function processInstallName(args: any): any;
/**
 * processing the command line input
 * @param {array} arg -- process.argv
 * @return {promise} resolve <configObjType>
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
