import express, { Request, Response } from "express";
import yaml from "js-yaml";
import RedocExpress from "redoc-express";
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';

export default function addDocsRoute(pathToSwaggerFile: string) {

    function whatType() {
        const jsonRegex = /\bjson\b/i;
        const yamlRegex = /\byaml\b/i;

        const fileName = pathToSwaggerFile
            .split('\\')
            .pop()
            ?.split('.')
            .pop();

        if (fileName && (yamlRegex.test(fileName))) {
            return 'yaml';
        }
        else if (fileName && (jsonRegex.test(fileName))) {
            return 'json';
        }
        else
            throw new Error('the presumable OpenAPI file type is not supported');
    };

    function loadTheFile() {

        const fileType = whatType();

        switch (fileType) {
            case 'yaml': {
                const fileContents = fs.readFileSync(pathToSwaggerFile, 'utf8');
                return {
                    yamlV: yaml.dump(yaml.load(fileContents), { indent: 2, lineWidth: 120 }),
                    jsonV: yaml.load(fileContents)
                };
            }
            case 'json': {
                const fileContents = JSON.parse(fs.readFileSync(pathToSwaggerFile, 'utf8'));
                return {
                    yamlV: yaml.dump(fileContents, { indent: 2, lineWidth: 120 }),
                    jsonV: fileContents
                };
            }
            default:
                throw new Error('the presumable OpenAPI file type is not supported');
        }
    };

    const openapiSpec = loadTheFile();

    const router = express.Router();

    router.use('/swagger', swaggerUi.serve, swaggerUi.setup(openapiSpec.jsonV));

    router.get(
        "/redocly",
        RedocExpress({
            specUrl: `swagger.yaml`,
            title: "API Documentation",
        })
    );

    router.get(`/swagger.yaml`, (req: Request, res: Response) => {
        if (whatType() === 'yaml')
            res.sendFile(pathToSwaggerFile);
        else {
            fs.writeFileSync(path.join(__dirname, '..', 'resources', 'swagger.yaml'), openapiSpec.yamlV);
            res.sendFile(path.join(__dirname, '..', 'resources', 'swagger.yaml'));
        }
    });

    router.get(`/swagger.json`, (req: Request, res: Response) => {
        res.json(openapiSpec.jsonV);

    });

    router.get('/',
        (req: Request, res: Response) => {
            const homePage = fs.readFileSync(path.join(__dirname, '..', 'resources', 'menu.html'), 'utf8');
            const output = homePage
                .replace("{{swagger.json}}", `${req.originalUrl}/swagger.json`)
                .replace("{{swagger.yaml}}", `${req.originalUrl}/swagger.yaml`)
                .replace("{{redocly}}", `${req.originalUrl}/redocly`)
                .replace("{{swagger}}", `${req.originalUrl}/swagger`);

            res.send(output);
        }
    );

    return router;
}



