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
        (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '..', 'resources', 'menu.html'));
        }
    );

    return router;
}



