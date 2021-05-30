"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execp = exports.overwritePkgJson = exports.checkExist = void 0;
const tslib_1 = require("tslib");
// src/util.ts
const fs_extra_1 = require("fs-extra");
const child_process_1 = require("child_process");
/**
 * check if that exist in the predefined array of values
 * @param {array} arr
 * @param {string} arg
 * @return {boolean}
 */
function checkExist(arr, arg) {
    return arr.filter(a => a === arg.toLowerCase()).length > 0;
}
exports.checkExist = checkExist;
// lots of little method that get share betwen
// so I put them all here
/**
 * just overwrite the existing package.json
 * @param {string} pkgFile path to package.json
 * @param {object} pkg content of the json
 * @return {promise} not throw error that means success
 */
function overwritePkgJson(pkgFile, pkg) {
    return fs_extra_1.writeJson(pkgFile, pkg, { spaces: 2 });
}
exports.overwritePkgJson = overwritePkgJson;
/**
 * wrap exec into an Promise
 * @param {string} cmd to run
 * @param {string} cwd where to execute this cmd
 * @return {promise<any>}
 */
function execp(cmd, cwd) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolver, rejecter) => {
            child_process_1.exec(cmd, { cwd }, (error, stdout, stderr) => {
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
        });
    });
}
exports.execp = execp;
