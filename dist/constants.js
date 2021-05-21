"use strict";
// put all the constants var in one place
Object.defineProperty(exports, "__esModule", { value: true });
exports.YML_EXT = exports.ACTION_MAP = exports.ACTIONS = exports.PKG_FILE = exports.PLACEHOLDER = void 0;
exports.PLACEHOLDER = '__PLACEHOLDER__';
exports.PKG_FILE = 'package.json';
exports.ACTIONS = ['github', 'gitlab'];
exports.ACTION_MAP = {
    github: ".github/workflows/lint-and-test.yml",
    gitlab: ".gitlab-ci.yml"
};
exports.YML_EXT = 'yml';
//# sourceMappingURL=constants.js.map