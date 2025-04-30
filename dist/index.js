"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addDocsRoute;
const express_1 = __importDefault(require("express"));
const yamljs_1 = __importDefault(require("yamljs"));
const redoc_express_1 = __importDefault(require("redoc-express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
function addDocsRoute(pathToSwaggerFile) {
    const fileName = pathToSwaggerFile.split('\\').pop();
    const openapiSpec = yamljs_1.default.load(pathToSwaggerFile);
    const router = express_1.default.Router();
    router.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiSpec));
    router.get("/redocly", (0, redoc_express_1.default)({
        specUrl: `${fileName}`,
        title: "API Documentation",
    }));
    router.get(`/${fileName}`, (req, res) => {
        res.sendFile(pathToSwaggerFile);
    });
    router.get('/', (req, res) => {
        res.send(`<header
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
                `);
    });
    return router;
}
