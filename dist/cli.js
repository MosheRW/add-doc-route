#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = __importDefault(require("./index"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const open_1 = __importDefault(require("open"));
let PATH;
commander_1.program
    .name('add-doc-route')
    .version('1.0.7')
    .description('add-doc-route, a simple way to add OpenAPI documentation to your express app')
    .option('-p --path <path>', 'set the default path to OpenAPI spec file (json or yaml)')
    .option('-r --run [path]', 'run server with provided path to OpenAPI spec file (json or yaml), or with the default path')
    .option('--red --redocly [path]', 'run server with provided path to OpenAPI spec file (json or yaml), or with the default path, opens the redoc web page')
    .option('-s --swagger [path]', 'run server with provided path to OpenAPI spec file (json or yaml), or with the default path, opens the swagger web page')
    .parse(process.argv);
const options = commander_1.program.opts();
if (options.path) {
    PATH = options.path;
}
if (options.run) {
    const finalPath = options.run || PATH;
    if (!(typeof finalPath === 'string') || !finalPath || !fs_1.default.existsSync(finalPath)) {
        console.error('no path provided');
        process.exit(1);
    }
    ;
    openApp(finalPath, '');
}
if (options.redocly) {
    const finalPath = options.redocly || PATH;
    if (!(typeof finalPath === 'string') || !finalPath || !fs_1.default.existsSync(finalPath)) {
        console.error('no path provided');
        process.exit(1);
    }
    ;
    openApp(finalPath, 'redocly');
}
if (options.swagger) {
    const finalPath = options.swagger || PATH;
    if (!(typeof finalPath === 'string') || !finalPath || !fs_1.default.existsSync(finalPath)) {
        console.error('no path provided');
        process.exit(1);
    }
    ;
    openApp(finalPath, 'swagger');
}
function openApp(path, route) {
    const app = (0, express_1.default)();
    app.use('/', (0, index_1.default)(path));
    app.listen(3000);
    (0, open_1.default)(`http://localhost:3000/${route}`);
    console.log(`server running on http://localhost:3000/${route}`);
}
