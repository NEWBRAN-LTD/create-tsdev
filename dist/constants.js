"use strict";
// put all the constants var in one place
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.TPL_EXT = exports.YML_EXT = exports.ACTION_MAP = exports.SETTING_FILES = exports.BASE_FILES = exports.TARGET_KEYS = exports.TEMPLATES = exports.ACTIONS = exports.PKG_FILE = exports.CLI_NAME = exports.TPL_NAME = exports.ACTION_NAME = exports.PLACEHOLDER = void 0;
exports.PLACEHOLDER = '__PLACEHOLDER__';
exports.ACTION_NAME = 'action';
exports.TPL_NAME = 'tpl';
exports.CLI_NAME = 'cli';
exports.PKG_FILE = 'package.json';
exports.ACTIONS = ['github', 'gitlab'];
exports.TEMPLATES = ['cli', 'koa']; // @TODO add aws later
exports.TARGET_KEYS = ["test", "lint", "build", "clean", "ts-node", "docs"];
exports.BASE_FILES = ['clean.js'];
// these files were not part of the npm, therefore need to handle it differently
exports.SETTING_FILES = [
    ['gitignore.tpl', '.gitignore'],
    ['eslintrc.tpl', '.eslintrc.js']
];
exports.ACTION_MAP = {
    github: ".github/workflows/lint-and-test.yml",
    gitlab: ".gitlab-ci.yml"
};
exports.YML_EXT = 'yml';
exports.TPL_EXT = '.tpl';
exports.DEFAULT_OPTIONS = {
    to: exports.PLACEHOLDER,
    skipInstall: false,
    action: exports.PLACEHOLDER,
    tpl: exports.PLACEHOLDER
};
