import express, { Request, Response } from "express";
import YAML from "yamljs";
import RedocExpress from "redoc-express";
import swaggerUi from 'swagger-ui-express';


export default function addDocsRoute(pathToSwaggerFile: string) {

    const fileName = pathToSwaggerFile.split('\\').pop();

    const openapiSpec = YAML.load(pathToSwaggerFile);

    const router = express.Router();

    router.use('/swagger', swaggerUi.serve, swaggerUi.setup(openapiSpec));

    router.get(
        "/redocly",
        RedocExpress({
            specUrl: `${fileName}`,
            title: "API Documentation",
        })
    );

    router.get(`/${fileName}`, (req, res) => {
        res.sendFile(pathToSwaggerFile);
    });

    router.get('/',
        (req, res) => {
            res.send(
                `<header
                style="display: flex; justify-self: center">
                    <h1>under-1000 API specification</h1>                
                </header>`
                +
                `<body
                style="justify-self: center">
                    <a
                    href=${req.baseUrl}/swagger
                    style="display: inline-block; padding: 10px 15px; background-color: green; color: white; text-decoration: none; border-radius: 5px;">
                        swagger
                    </a>
                    <a
                    href=${req.baseUrl}/redocly
                    style="display: inline-block; padding: 10px 15px; background-color: blue; color: white; text-decoration: none; border-radius: 5px;">
                        redocly
                    </a>
                    <a
                    href=${req.baseUrl}/${fileName}
                    style="display: inline-block; padding: 10px 15px; background-color: blue; color: white; text-decoration: none; border-radius: 5px;">
                        swagger.yaml doc
                    </a>               
                </body>`
                +
                `
                `

            )
        }
    );

    return router;
}



