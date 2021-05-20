import { CustomError } from './custom-error';
declare type configObj = {
    to?: String;
    skipInstall?: Boolean;
};
export { CustomError };
/**
 * @param {array} arg -- process.argv
 * @return {promise} resolve nothing
 */
export declare function processArg(argv: Array<String>): Promise<configObj>;
/**
 * pass the `to` prop and switch over to that directory
 * @param {string} where to
 * @return {*}
 */
export declare function changeAndGetPkg(where: string): any;
/**
 * copy over the properties
 * @param {object} pkg
 * @return {object}
 */
export declare function copyProps(pkg: any): any;
