#!/usr/bin/env node

import { program } from 'commander';
import addDocsRoute from './index';
import express from 'express';
import fs from 'fs';
import open from 'open';


let PATH: string | undefined;

program
    .name('add-doc-route')
    .version('1.0.7')
    .description('add-doc-route, a simple way to add OpenAPI documentation to your express app')
    .option('-p --path <path>', 'set the default path to OpenAPI spec file (json or yaml)')
    .option('-r --run [path]', 'run server with provided path to OpenAPI spec file (json or yaml), or with the default path')
    .option('--red --redocly [path]', 'run server with provided path to OpenAPI spec file (json or yaml), or with the default path, opens the redoc web page')
    .option('-s --swagger [path]', 'run server with provided path to OpenAPI spec file (json or yaml), or with the default path, opens the swagger web page')

    .parse(process.argv);

const options = program.opts();

if (options.path) {
    PATH = options.path;
}

if (options.run) {
    const finalPath: string = options.run || PATH;

    if (!(typeof finalPath === 'string') || !finalPath || !fs.existsSync(finalPath)) {
        console.error('no path provided');
        process.exit(1);
    };

    openApp(finalPath, '');
}

if (options.redocly) {
    const finalPath: string = options.redocly || PATH;

    if (!(typeof finalPath === 'string') || !finalPath || !fs.existsSync(finalPath)) {
        console.error('no path provided');
        process.exit(1);
    };

    openApp(finalPath, 'redocly');
}

if (options.swagger) {
    const finalPath: string = options.swagger || PATH;

    if (!(typeof finalPath === 'string') || !finalPath || !fs.existsSync(finalPath)) {
        console.error('no path provided');
        process.exit(1);
    };

    openApp(finalPath, 'swagger');
}

function openApp(path: string, route: string) {
    const app = express();
    app.use('/', addDocsRoute(path));
    app.listen(3000);
    open(`http://localhost:3000/${route}`);
    console.log(`server running on http://localhost:3000/${route}`);
}