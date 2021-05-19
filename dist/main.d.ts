declare type configObj = {
    to?: String;
    skipInstall?: Boolean;
};
/**
 * @param {array} arg -- process.argv
 * @return {promise} resolve nothing
 */
export declare function processArg(argv: Array<String>): Promise<configObj>;
export {};
