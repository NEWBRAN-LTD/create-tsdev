"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTpl = void 0;
const tslib_1 = require("tslib");
// src/template.ts
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const util_1 = require("./util");
const constants_1 = require("./constants");
// this is potentially a problem because it sets here
// but when call the chdir it didn't change it
const baseDir = path_1.resolve(__dirname, 'tpl');
const appRoot = path_1.resolve(__dirname, '..');
const cliBaseDir = path_1.join(baseDir, 'cli');
const koaBaseDir = path_1.join(baseDir, 'koa');
// const awsBaseDir: string = join(baseDir, 'aws')
const koaTemplates = [
    'app.ts.tpl',
    'server.ts.tpl',
    'router.ts.tpl'
];
const configTpl = [
    'tsconfig.json'
];
const testTpl = [
    'server.test.ts.tpl'
];
const npmTodo = 'npm.json';
/**
 * bit of hack to get the path where we wanted
 * @return {*} key value
 */
function getDest() {
    const destRoot = process.cwd();
    return {
        destRoot,
        destSrc: path_1.join(destRoot, 'src'),
        destTest: path_1.join(destRoot, 'tests'),
        destPkgJson: path_1.join(destRoot, constants_1.PKG_FILE)
    };
}
/**
 * handle the koa template
 * @TODO this should turn into a factory method for all the different templates
 * @param {object} args for future development if they want db template or not
 * @return {Promise<any>} should be just true / false
 */
function koa(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { destRoot, destSrc, destTest, destPkgJson } = getDest();
        // first copy the taget files
        return Promise.all(koaTemplates.map(tpl => fs_extra_1.copy(path_1.join(koaBaseDir, tpl), path_1.join(destSrc, util_1.removeTpl(tpl))))
            .concat(configTpl.map(tpl => fs_extra_1.copy(path_1.join(koaBaseDir, tpl), path_1.join(destRoot, util_1.removeTpl(tpl))))
            .concat(testTpl.map(tpl => fs_extra_1.copy(path_1.join(koaBaseDir, tpl), path_1.join(destTest, util_1.removeTpl(tpl)))))))
            .then(() => {
            // next read the npm.json
            const npmJson = fs_extra_1.readJsonSync(path_1.join(koaBaseDir, npmTodo));
            // update the root package.json
            const pkgJson = fs_extra_1.readJsonSync(destPkgJson);
            // just overwrite it
            pkgJson.scripts = Object.assign(pkgJson.scripts, npmJson.scripts);
            return util_1.overwritePkgJson(destPkgJson, pkgJson)
                .then(() => npmJson);
        })
            .then(npmJson => {
            if (process.env.NODE_ENV !== 'test') {
                // finally run the install
                return Promise.all(npmJson.npm.map((cmd) => util_1.execp(`npm ${cmd}`, destRoot))).then(() => args);
            }
            return args;
        });
    });
}
/**
 * To create some start-up template or not
 * 1. If skipTpl === true then no
 * 2. If they already have a ./src folder then no
 * @param {object} args
 * @return {Promise<configObjType>}
 */
function processBaseTemplate(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { destRoot, destSrc, destTest } = getDest();
        // this will get copy over no matter what
        const files = constants_1.BASE_FILES.map(file => [path_1.join(appRoot, file), path_1.join(destRoot, file)]);
        // from here we need to change if the user use --tpl koa|aws
        // we combine the tpl here and not using the skipInstall anymore
        if (args.tpl === constants_1.CLI_NAME && !fs_extra_1.existsSync(destSrc)) {
            console.log(`Install cli template`);
            files.push([path_1.join(cliBaseDir, 'main.tpl'), path_1.join(destSrc, 'main.ts')], [path_1.join(cliBaseDir, 'main.test.tpl'), path_1.join(destTest, 'main.test.ts')]);
        }
        return Promise.all(files.map(fileTodo => Reflect.apply(fs_extra_1.copy, null, fileTodo)))
            .then(() => args);
    });
}
/**
 * This will handle all sort of different template action
 * This will be the last method to get all in the chain
 * This is the top level method then call the other sub method
 * due to different template has it's own settings
 * @param {*} args of the template
 */
function createTemplate(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { tpl } = args;
        switch (tpl) {
            case 'koa':
                console.log(`Install koa template`);
                args.skipInstall = true; // make sure the final install not going to happen
                return koa(args);
            case 'aws':
            default:
                return Promise.resolve(args);
        }
    });
}
/**
 * The only export method, it also does the install here and skip the next call
 * @param {object} args from the command line options
 * @return {Promise<any>}
 */
function setupTpl(args) {
    return processBaseTemplate(args)
        .then(args => createTemplate(args));
}
exports.setupTpl = setupTpl;
