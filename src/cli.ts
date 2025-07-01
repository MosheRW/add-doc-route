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

export function openApp(path: string, route: string, port: number = 3000, tries: number = 0): void {

    const app = express();
    app.use('/', addDocsRoute(path));

    const server = app.listen(port);

    server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE' && tries < 10) {
            openApp(path, route, port + 1, tries + 1);
        } else {
            console.error('Server error:', error);
            process.exit(1);
        }
    });

    server.on('listening',
        () => {
            if (tries > 0)
                console.log(`port ${port - tries} already in use,\nserver running on http://localhost:${port}/${route}`);
            else
                console.log(`server running on http://localhost:${port}/${route}`);
            open(`http://localhost:${port}/${route}`);
        }
    );
}
