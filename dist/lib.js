"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInstall = exports.overwritePkgJson = exports.copyProps = exports.changeAndGetPkg = exports.processArg = exports.CustomError = void 0;
const tslib_1 = require("tslib");
// lib.ts libraries of functions
const path_1 = require("path");
const child_process_1 = require("child_process");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const custom_error_1 = require("./custom-error");
Object.defineProperty(exports, "CustomError", { enumerable: true, get: function () { return custom_error_1.CustomError; } });
const PKG_FILE = 'package.json';
/**
 * @param {array} arg -- process.argv
 * @return {promise} resolve nothing
 */
function processArg(argv) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return Promise.resolve(argv)
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
 * @return {array} [ pkgFile, json ]
 */
function changeAndGetPkg(where) {
    if (fs_extra_1.default.existsSync(where)) {
        process.chdir(where);
        const dir = process.cwd();
        const pkgFile = path_1.join(dir, PKG_FILE);
        if (fs_extra_1.default.existsSync(pkgFile)) {
            // return a tuple instead
            return [
                pkgFile,
                fs_extra_1.default.readJsonSync(pkgFile)
            ];
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
/**
 * just overwrite the existing package.json
 * @param {string} pkgFile path to package.json
 * @param {object} pkg content of the json
 * @return {promise} not throw error that means success
 */
function overwritePkgJson(pkgFile, pkg) {
    return fs_extra_1.default.writeJson(pkgFile, pkg);
}
exports.overwritePkgJson = overwritePkgJson;
/**
 * Execute a npm install if they didn't supply the --noInstall
 * @param {object} args from command line
 * @return {void}
 */
function runInstall(args) {
    if (args.skipInstall !== true) {
        child_process_1.exec("npm install", { cwd: process.cwd() }, (error, stdout, stderr) => {
            if (error) {
                console.error(`ERROR:`, error);
                return;
            }
            console.log(`stdout`, stdout);
            if (stderr) {
                console.error(`stderr`, stderr);
            }
        });
    }
    else {
        console.log(`All done nothing to do`);
    }
}
exports.runInstall = runInstall;
//# sourceMappingURL=lib.js.map