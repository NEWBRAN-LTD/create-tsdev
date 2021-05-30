"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// src/app.ts
// DON'T USE import * as Koa from 'koa'! it will crash 
const koa_1 = tslib_1.__importDefault(require("koa"));
const http_status_codes_1 = tslib_1.__importDefault(require("http-status-codes"));
// import router from './router'
const app = new koa_1.default();
// Generic error handling middleware.
app.use((ctx, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield next();
    }
    catch (error) {
        ctx.status = error.statusCode || error.status || http_status_codes_1.default.INTERNAL_SERVER_ERROR;
        error.status = ctx.status;
        ctx.body = { error };
        ctx.app.emit('error', error, ctx);
    }
}));
// Initial route
app.use((ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    ctx.body = 'Hello world';
}));
// remove the above code and uncomment this once you done with your router
/*
app.use(router.routes());
app.use(router.allowedMethods());
*/
// Application error logging.
app.on('error', console.error);
exports.default = app;
