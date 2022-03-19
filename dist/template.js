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
const baseDir = path_1.resolve(__dirname, constants_1.TPL_NAME);
const appRoot = path_1.resolve(__dirname, '..');
const cliBaseDir = path_1.join(baseDir, constants_1.CLI_NAME);
const koaBaseDir = path_1.join(baseDir, constants_1.KOA_NAME);
// const awsBaseDir: string = join(baseDir, 'aws')
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
        return Promise.all(constants_1.KOA_TPLS.map(tpl => fs_extra_1.copy(path_1.join(koaBaseDir, tpl), path_1.join(destSrc, util_1.removeTpl(tpl))))
            .concat(constants_1.CONFIG_TPLS.map(tpl => fs_extra_1.copy(path_1.join(koaBaseDir, tpl), path_1.join(destRoot, util_1.removeTpl(tpl))))
            .concat(constants_1.TEST_TPLS.map(tpl => fs_extra_1.copy(path_1.join(koaBaseDir, tpl), path_1.join(destTest, util_1.removeTpl(tpl)))))))
            .then(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // next read the npm.json - should check if this exist
            const npmJsonDest = path_1.join(koaBaseDir, constants_1.NPM_TODO);
            const npmJson = fs_extra_1.existsSync(npmJsonDest) ? fs_extra_1.readJsonSync(npmJsonDest) : {};
            const pkgJson = fs_extra_1.readJsonSync(destPkgJson);
            // update the root package.json, just overwrite it
            pkgJson.scripts = Object.assign(pkgJson.scripts, npmJson.scripts);
            // change from a promise callback
            yield util_1.overwritePkgJson(destPkgJson, pkgJson);
            return npmJson;
        }))
            .then(npmJson => {
            // this npm.json store some of our pre-defined options
            // console.log('npmJson', npmJson)
            // is this wrong?
            if (process.env.NODE_ENV !== 'test') {
                // finally run the install - this should be for Koa template ONLY
                // this is wrong if the user didn't select the --install option!
                // @BUG @TODO
                return Promise.all(npmJson.npm.map((cmd) => {
                    console.log('Running: ', `npm ${cmd}`);
                    return util_1.execp(`npm ${cmd}`, destRoot);
                })).then(() => args);
            }
            return args;
        });
    });
}
/**
 * prepare all the required based files
 * @param {string} appRoot org
 * @param {string} destRoot dest
 * @return {Array<*>}
 */
function getBaseCopyFiles(appRoot, destRoot) {
    return constants_1.BASE_FILES.map(file => [path_1.join(appRoot, file), path_1.join(destRoot, file)])
        .concat(constants_1.SETTING_FILES.map(([org, dest]) => [
        path_1.join(baseDir, org), path_1.join(destRoot, dest)
    ]));
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
        const files = getBaseCopyFiles(appRoot, destRoot);
        // v0.6.4 need to handle these files differently
        // from here we need to change if the user use --tpl koa|aws
        // we combine the tpl here and not using the skipInstall anymore
        if (args.tpl === constants_1.CLI_NAME && !fs_extra_1.existsSync(destSrc)) {
            console.log(`Install cli template`);
            // this is really ugly!
            files.push([path_1.join(cliBaseDir, constants_1.CLI_TPLS[0]), path_1.join(destSrc, constants_1.CLI_TPLS[0].replace(constants_1.TPL_EXT, constants_1.TS_EXT))], [path_1.join(cliBaseDir, constants_1.CLI_TPLS[1]), path_1.join(destTest, constants_1.CLI_TPLS[1].replace(constants_1.TPL_EXT, constants_1.TS_EXT))]);
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return processBaseTemplate(args)
            .then(createTemplate);
    });
}
exports.setupTpl = setupTpl;
