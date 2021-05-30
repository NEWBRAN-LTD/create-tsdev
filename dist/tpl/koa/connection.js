"use strict";
// src/connection.ts
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const path_1 = require("path");
const parentDir = path_1.join(__dirname, '..');
const connectionOpts = {
    type: 'sqlite',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'typescript-koa',
    entities: [
        `${parentDir}/**/*.entity.ts`,
    ],
    synchronize: true,
};
const connection = typeorm_1.createConnection(connectionOpts);
exports.default = connection;
