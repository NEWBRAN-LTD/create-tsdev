/**
 * just show a banner with version
 */
export declare function banner(): void;
/**
 * Take the tpl ext off from path
 * @param {string} tpl
 * @return {string}
 */
export declare function removeTpl(str: string): string;
/**
 * check if that exist in the predefined array of values
 * @param {array} arr
 * @param {string} arg
 * @return {boolean}
 */
export declare function checkExist(arr: Array<any>, arg: string): boolean;
/**
 * just overwrite the existing package.json
 * @param {string} pkgFile path to package.json
 * @param {object} pkg content of the json
 * @return {promise} not throw error that means success
 */
export declare function overwritePkgJson(pkgFile: string, pkg: any): Promise<any>;
/**
 * wrap exec into an Promise
 * @param {string} cmd to run
 * @param {string} cwd where to execute this cmd
 * @return {promise<any>}
 */
export declare function execp(cmd: string, cwd: string): Promise<any>;
