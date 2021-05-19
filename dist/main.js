"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processArg = void 0;
const tslib_1 = require("tslib");
/**
 * @param {array} arg -- process.argv
 * @return {promise} resolve nothing
 */
function processArg(argv) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return Promise.resolve(argv.slice(2))
            .then(args => {
            return args.reduce((a, arg) => {
                if (a.to !== undefined) {
                    a.to = arg;
                }
                else if (arg.toLowerCase() === '--to') {
                    a.to = ''; // placeholder
                }
                else if (arg === '--skipInstall') {
                    a.skipInstall = true;
                }
                return a;
            }, {});
        });
    });
}
exports.processArg = processArg;
//# sourceMappingURL=main.js.map