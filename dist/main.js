"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyProps = exports.changeAndGetPkg = exports.processArg = exports.CustomError = void 0;
const tslib_1 = require("tslib");
// main.ts
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const path_1 = require("path");
const custom_error_1 = require("./custom-error");
Object.defineProperty(exports, "CustomError", { enumerable: true, get: function () { return custom_error_1.CustomError; } });
const PKG_FILE = 'package.json';
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
/**
 * pass the `to` prop and switch over to that directory
 * @param {string} where to
 * @return {*}
 */
function changeAndGetPkg(where) {
    if (fs_extra_1.default.existsSync(where)) {
        process.chdir(where);
        const dir = process.cwd();
        const pkgFile = path_1.join(dir, PKG_FILE);
        if (fs_extra_1.default.existsSync(pkgFile)) {
            return fs_extra_1.default.readJsonSync(pkgFile);
        }
    }
    // just for f**king around with Typescript
    throw new custom_error_1.CustomError(new TypeError(`${where} does not exist`));
}
exports.changeAndGetPkg = changeAndGetPkg;
/**
 * copy over the properties
 * @param {object} pkg
 * @return {object}
 */
function copyProps(pkg) {
    const pathToPkg = path_1.resolve(__dirname, '..', PKG_FILE);
    const myPkg = fs_extra_1.default.readJsonSync(pathToPkg);
    // first merge the devDependencies
    pkg.devDependencies = Object.assign(pkg.devDependencies || {}, myPkg.devDependencies);
    // next add the ava options
    pkg.ava = myPkg.ava;
    // finally add some of the scripts
    const keys = ["test", "lint", "build", "clean", "ts-node", "docs"];
    pkg.scripts = keys.reduce((obj, key) => (Object.assign(obj, { [key]: myPkg.scripts[key] })), pkg.scripts || {});
    pkg.dependencies = Object.assign(pkg.dependencies || {}, myPkg.dependencies);
    return pkg;
}
exports.copyProps = copyProps;
//# sourceMappingURL=main.js.map