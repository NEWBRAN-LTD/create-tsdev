"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installAction = exports.runInstall = exports.overwritePkgJson = exports.copyProps = exports.changeAndGetPkg = exports.processArg = exports.CustomError = void 0;
const tslib_1 = require("tslib");
// lib.ts libraries of functions
const path_1 = require("path");
const child_process_1 = require("child_process");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const custom_error_1 = require("./custom-error");
Object.defineProperty(exports, "CustomError", { enumerable: true, get: function () { return custom_error_1.CustomError; } });
const constants_1 = require("./constants");
/**
 * @param {array} arg -- process.argv
 * @return {promise} resolve nothing
 */
function processArg(argv) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return Promise.resolve(argv)
            .then(args => {
            return args.reduce((a, arg) => {
                switch (true) {
                    case (a.to === constants_1.PLACEHOLDER):
                        a.to = arg;
                        break;
                    case (arg.toLowerCase() === '--to'):
                        a.to = constants_1.PLACEHOLDER; // placeholder
                        break;
                    case (arg === '--skipInstall'):
                        a.skipInstall = true;
                        break;
                    case (arg.toLowerCase() === '--action'):
                        a.action = constants_1.PLACEHOLDER; // placeholder
                        break;
                    case (a.action === constants_1.PLACEHOLDER):
                        if (constants_1.ACTIONS.find(a => a === arg.toLowerCase())) {
                            a.action = arg.toLowerCase();
                        }
                        break;
                    default:
                    // do nothing
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
        const pkgFile = path_1.join(dir, constants_1.PKG_FILE);
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
    const pathToPkg = path_1.resolve(__dirname, '..', constants_1.PKG_FILE);
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
 * @return {promise}
 */
function runInstall(args) {
    return new Promise((resolver, rejecter) => {
        if (args.skipInstall === true && process.env.NODE_ENV !== 'test') {
            child_process_1.exec("npm install", { cwd: process.cwd() }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`ERROR:`, error);
                    return rejecter(false);
                }
                console.log(`stdout`, stdout);
                if (stderr) {
                    console.error(`stderr`, stderr);
                }
                resolver(true);
            });
        }
        else {
            console.log(`All done nothing to do`);
            resolver(true);
        }
    });
}
exports.runInstall = runInstall;
/**
 * copy over the github / gitlab action
 * @param {object} args from cli
 * @return {promise} true on success
 */
function installAction(args) {
    return new Promise((resolver, rejecter) => {
        const _act = args.action;
        if (_act && _act !== constants_1.PLACEHOLDER) {
            const ymlFile = path_1.join(__dirname, 'actions', [_act, constants_1.YML_EXT].join('.'));
            console.log(ymlFile);
            const dest = constants_1.ACTION_MAP[_act];
            // stupid hack
            if (_act === 'github') {
                fs_extra_1.default.ensureDir(path_1.dirname(dest));
            }
            fs_extra_1.default.copy(ymlFile, dest, (err) => {
                if (err) {
                    return rejecter(false);
                }
                resolver(true);
            });
        }
        else {
            resolver(true);
        }
    });
}
exports.installAction = installAction;
//# sourceMappingURL=lib.js.map