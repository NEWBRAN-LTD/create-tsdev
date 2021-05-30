"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// src/server.ts
// koa server basic setup
const app_1 = tslib_1.__importDefault(require("./app"));
// Process.env will always be comprised of strings, so we typecast the port to a
// number.
const PORT = Number(process.env.PORT) || 3000;
app_1.default.listen(PORT);
