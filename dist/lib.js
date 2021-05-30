"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installAction = exports.runInstall = exports.copyProps = exports.changeAndGetPkg = exports.processArg = exports.CustomError = void 0;
const tslib_1 = require("tslib");
// lib.ts libraries of functions
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const custom_error_1 = require("./custom-error");
Object.defineProperty(exports, "CustomError", { enumerable: true, get: function () { return custom_error_1.CustomError; } });
const constants_1 = require("./constants");
const util_1 = require("./util");
/**
 * processing the command line input
 * @param {array} arg -- process.argv
 * @return {promise} resolve <configObjType>
 */
function processArg(argv) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return Promise.resolve(argv)
            .then(args => {
            const keys = Object.keys(constants_1.DEFAULT_OPTIONS);
            return keys
                .filter(key => {
                const check = argv[key] !== undefined;
                // need to check this one
                if (check && key === constants_1.ACTION_NAME) {
                    const arg = args[key];
                    switch (key) {
                        case constants_1.ACTION_NAME:
                            return util_1.checkExist(constants_1.ACTIONS, arg);
                        case constants_1.TPL_NAME:
                            return util_1.checkExist(constants_1.TEMPLATES, arg);
                        default:
                            return false;
                    }
                }
                return check;
            })
                .map(key => ({ [key]: args[key] }))
                .reduce((a, b) => Object.assign(a, b), {});
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
    if (fs_extra_1.existsSync(where)) {
        process.chdir(where);
        const pkgFile = path_1.join(where, constants_1.PKG_FILE);
        if (fs_extra_1.existsSync(pkgFile)) {
            // return a tuple instead
            return [
                pkgFile,
                fs_extra_1.readJsonSync(pkgFile)
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
    const myPkg = fs_extra_1.readJsonSync(pathToPkg);
    // first merge the Dependencies
    pkg.dependencies = Object.assign(pkg.dependencies || {}, myPkg.dependencies);
    pkg.devDependencies = Object.assign(pkg.devDependencies || {}, myPkg.devDependencies);
    // next add the ava options
    pkg.ava = myPkg.ava;
    // finally add some of the scripts
    pkg.scripts = constants_1.TARGET_KEYS.reduce((obj, key) => (Object.assign(obj, { [key]: myPkg.scripts[key] })), pkg.scripts || {});
    return pkg;
}
exports.copyProps = copyProps;
/**
 * Execute a npm install if they didn't supply the --noInstall
 * @param {object} args from command line
 * @return {promise}
 */
function runInstall(args) {
    if (args.skipInstall !== true && process.env.NODE_ENV !== 'test') {
        return util_1.execp("npm install", process.cwd());
    }
    return Promise.resolve(true);
}
exports.runInstall = runInstall;
/**
 * copy over the github / gitlab action
 * @param {object} args from cli
 * @return {promise} true on success
 */
function installAction(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const _act = args.action;
        if (_act && _act !== constants_1.PLACEHOLDER) {
            const ymlFile = path_1.join(__dirname, 'actions', [_act, constants_1.YML_EXT].join('.'));
            const dest = path_1.join(process.cwd(), constants_1.ACTION_MAP[_act]);
            // stupid hack
            if (_act === 'github') {
                fs_extra_1.ensureDir(path_1.dirname(dest));
            }
            return fs_extra_1.copy(ymlFile, dest)
                .then(() => {
                console.log(`${_act} ${constants_1.YML_EXT} install to ${dest}`);
                return args;
            })
                .catch(err => {
                console.error(`Copy ${_act} ${constants_1.YML_EXT} failed`, err);
            });
        }
        // noting to do, same question as below
        return args;
    });
}
exports.installAction = installAction;
