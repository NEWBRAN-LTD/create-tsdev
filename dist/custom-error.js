"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(parent) {
        super(parent.message);
        this.parent = parent;
    }
}
exports.CustomError = CustomError;
