"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTpl = exports.installAction = exports.runInstall = exports.overwritePkgJson = exports.copyProps = exports.changeAndGetPkg = exports.processArg = exports.CustomError = void 0;
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
            const keys = Object.keys(constants_1.DEFAULT_OPTIONS);
            return keys
                .filter(key => {
                const check = argv[key] !== undefined;
                // need to check this one
                if (check && key === constants_1.ACTION_NAME) {
                    const find = constants_1.ACTIONS.filter(a => a === args[key].toLowerCase());
                    return find.length > 0;
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
    if (fs_extra_1.default.existsSync(where)) {
        process.chdir(where);
        const pkgFile = path_1.join(where, constants_1.PKG_FILE);
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
 * just overwrite the existing package.json
 * @param {string} pkgFile path to package.json
 * @param {object} pkg content of the json
 * @return {promise} not throw error that means success
 */
function overwritePkgJson(pkgFile, pkg) {
    return fs_extra_1.default.writeJson(pkgFile, pkg, { spaces: 2 });
}
exports.overwritePkgJson = overwritePkgJson;
/**
 * Execute a npm install if they didn't supply the --noInstall
 * @param {object} args from command line
 * @return {promise}
 */
function runInstall(args) {
    return new Promise((resolver, rejecter) => {
        if (args.skipInstall !== true && process.env.NODE_ENV !== 'test') {
            console.log(`running npm install`);
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
    const _act = args.action;
    if (_act && _act !== constants_1.PLACEHOLDER) {
        const ymlFile = path_1.join(__dirname, 'actions', [_act, constants_1.YML_EXT].join('.'));
        const dest = path_1.join(process.cwd(), constants_1.ACTION_MAP[_act]);
        // stupid hack
        if (_act === 'github') {
            fs_extra_1.default.ensureDir(path_1.dirname(dest));
        }
        return fs_extra_1.default.copy(ymlFile, dest)
            .then(() => {
            console.log(`${_act} ${constants_1.YML_EXT} install to ${dest}`);
            return args;
        })
            .catch(err => {
            console.error(`Copy ${_act} ${constants_1.YML_EXT} failed`, err);
        });
    }
    // noting to do
    return Promise.resolve(args);
}
exports.installAction = installAction;
/**
 * To create some start-up template or not
 * 1. If skipTpl === true then no
 * 2. If they already have a ./src folder then no
 * @param {object} args
 * @return {Promise<configObjType>}
 */
function setupTpl(args) {
    if (args.skipTpl !== true) {
        const projectDir = process.cwd();
        const tplDir = path_1.join(__dirname, 'tpl');
        const srcDir = path_1.join(projectDir, 'src');
        if (!fs_extra_1.default.existsSync(srcDir)) {
            const files = [
                [path_1.join(tplDir, 'main.tpl'), path_1.join(projectDir, 'src', 'main.ts')],
                [path_1.join(tplDir, 'main.test.tpl'), path_1.join(projectDir, 'tests', 'main.test.ts')]
            ];
            return Promise.all(files.map(fileTodo => Reflect.apply(fs_extra_1.default.copy, null, fileTodo)))
                .then(() => args);
        }
    }
    return Promise.resolve(args);
}
exports.setupTpl = setupTpl;
//# sourceMappingURL=lib.js.map