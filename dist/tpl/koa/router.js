"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const routerOpts = {
    prefix: '/endpoint',
};
const router = new koa_router_1.default(routerOpts);
// just take what you need 
router.get('/', (ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    ctx.body = 'GET ALL';
}));
router.get('/:id', (ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    ctx.body = 'GET SINGLE';
}));
router.post('/', (ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    ctx.body = 'POST';
}));
router.delete('/:id', (ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    ctx.body = 'DELETE';
}));
router.patch('/:id', (ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    ctx.body = 'PATCH';
}));
exports.default = router;
