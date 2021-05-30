"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const tslib_1 = require("tslib");
// just create a top level main function
const lib_1 = require("./lib");
const util_1 = require("./util");
const template_1 = require("./template");
/**
 * Top level API
 * @param {Object} _args from process.argv could use the type but it will be pointless
 * @return {Promise<any>}
 * @public
 */
function main(_args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // there is no point of accepting input anyway
        return lib_1.processArg(_args)
            .then(args => {
            const [pkgFile, _pkg] = lib_1.changeAndGetPkg(args.to || process.cwd());
            const pkg = lib_1.copyProps(_pkg);
            return { args, pkg, pkgFile };
        })
            .then(({ args, pkg, pkgFile }) => (util_1.overwritePkgJson(pkgFile, pkg)
            .then(() => args)))
            // not ideal if the action fail then the next will not run
            .then(args => lib_1.installAction(args))
            .then(args => template_1.setupTpl(args))
            .then(args => lib_1.runInstall(args));
    });
}
exports.main = main;
