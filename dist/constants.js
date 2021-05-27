"use strict";
// put all the constants var in one place
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.YML_EXT = exports.ACTION_MAP = exports.TARGET_KEYS = exports.PKG_FILE = exports.ACTIONS = exports.ACTION_NAME = exports.PLACEHOLDER = void 0;
exports.PLACEHOLDER = '__PLACEHOLDER__';
exports.ACTION_NAME = 'action';
exports.ACTIONS = ['github', 'gitlab'];
exports.PKG_FILE = 'package.json';
exports.TARGET_KEYS = ["test", "lint", "build", "clean", "ts-node", "docs"];
exports.ACTION_MAP = {
    github: ".github/workflows/lint-and-test.yml",
    gitlab: ".gitlab-ci.yml"
};
exports.YML_EXT = 'yml';
exports.DEFAULT_OPTIONS = {
    to: exports.PLACEHOLDER,
    skipInstall: false,
    skipTpl: false,
    action: exports.PLACEHOLDER
};
