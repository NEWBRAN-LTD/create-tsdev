import { CustomError } from './custom-error';
declare type configObj = {
    to?: string;
    skipInstall?: boolean;
};
export { CustomError };
/**
 * @param {array} arg -- process.argv
 * @return {promise} resolve nothing
 */
export declare function processArg(argv: Array<string>): Promise<configObj>;
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
 * @return {void}
 */
export declare function runInstall(args: any): void;
