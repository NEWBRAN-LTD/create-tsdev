"use strict";
// put all the constants var in one place
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPM_TODO = exports.TEST_TPLS = exports.CONFIG_TPLS = exports.KOA_TPLS = exports.CLI_TPLS = exports.DEFAULT_OPTIONS = exports.TS_EXT = exports.TPL_EXT = exports.YML_EXT = exports.ACTION_MAP = exports.SETTING_FILES = exports.BASE_FILES = exports.TARGET_KEYS = exports.TEMPLATES = exports.ACTIONS = exports.PKG_FILE = exports.PACKAGE_MANAGERS = exports.YARN_NAME = exports.PNPM_NAME = exports.NPM_NAME = exports.KOA_NAME = exports.CLI_NAME = exports.TPL_NAME = exports.ACTION_NAME = exports.PLACEHOLDER = void 0;
exports.PLACEHOLDER = '__PLACEHOLDER__';
exports.ACTION_NAME = 'action';
exports.TPL_NAME = 'tpl';
exports.CLI_NAME = 'cli';
exports.KOA_NAME = 'koa';
exports.NPM_NAME = 'npm';
exports.PNPM_NAME = 'pnpm';
exports.YARN_NAME = 'yarn';
exports.PACKAGE_MANAGERS = [exports.NPM_NAME, exports.PNPM_NAME, exports.YARN_NAME];
exports.PKG_FILE = 'package.json';
exports.ACTIONS = ['github', 'gitlab'];
exports.TEMPLATES = [exports.CLI_NAME, exports.KOA_NAME]; // @TODO add aws later
exports.TARGET_KEYS = ["test", "lint", "build", "clean", "docs"];
exports.BASE_FILES = ['clean.js'];
// these files were not part of the npm, therefore need to handle it differently
exports.SETTING_FILES = [
    ['gitignore.tpl', '.gitignore'],
    ['eslintrc.tpl', '.eslintrc.js'],
    ['tsconfig.tpl', 'tsconfig.json']
];
exports.ACTION_MAP = {
    github: ".github/workflows/lint-and-test.yml",
    gitlab: ".gitlab-ci.yml"
};
exports.YML_EXT = 'yml';
exports.TPL_EXT = '.tpl';
exports.TS_EXT = '.ts';
exports.DEFAULT_OPTIONS = {
    to: exports.PLACEHOLDER,
    install: false,
    action: exports.PLACEHOLDER,
    tpl: exports.CLI_NAME
};
exports.CLI_TPLS = [
    'main.tpl',
    'main.test.tpl'
];
exports.KOA_TPLS = [
    'app.ts.tpl',
    'server.ts.tpl',
    'router.ts.tpl'
];
exports.CONFIG_TPLS = [
    'tsconfig.json'
];
exports.TEST_TPLS = [
    'server.test.ts.tpl'
];
exports.NPM_TODO = 'npm.json';
