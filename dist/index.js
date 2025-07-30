"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addDocsRoute;
const express_1 = __importDefault(require("express"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const redoc_express_1 = __importDefault(require("redoc-express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function addDocsRoute(pathToSwaggerFile) {
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
    }
    ;
    function loadTheFile() {
        const fileType = whatType();
        switch (fileType) {
            case 'yaml': {
                const fileContents = fs_1.default.readFileSync(pathToSwaggerFile, 'utf8');
                return {
                    yamlV: js_yaml_1.default.dump(js_yaml_1.default.load(fileContents), { indent: 2, lineWidth: 120 }),
                    jsonV: js_yaml_1.default.load(fileContents)
                };
            }
            case 'json': {
                const fileContents = JSON.parse(fs_1.default.readFileSync(pathToSwaggerFile, 'utf8'));
                return {
                    yamlV: js_yaml_1.default.dump(fileContents, { indent: 2, lineWidth: 120 }),
                    jsonV: fileContents
                };
            }
            default:
                throw new Error('the presumable OpenAPI file type is not supported');
        }
    }
    ;
    const openapiSpec = loadTheFile();
    const router = express_1.default.Router();
    router.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiSpec.jsonV));
    router.get("/redocly", (0, redoc_express_1.default)({
        specUrl: `swagger.yaml`,
        title: "API Documentation",
    }));
    router.get(`/swagger.yaml`, (req, res) => {
        if (whatType() === 'yaml')
            res.sendFile(pathToSwaggerFile);
        else {
            fs_1.default.writeFileSync(path_1.default.join(__dirname, '..', 'resources', 'swagger.yaml'), openapiSpec.yamlV);
            res.sendFile(path_1.default.join(__dirname, '..', 'resources', 'swagger.yaml'));
        }
    });
    router.get(`/swagger.json`, (req, res) => {
        res.json(openapiSpec.jsonV);
    });
    router.get('/', (req, res) => {
        const homePage = fs_1.default.readFileSync(path_1.default.join(__dirname, '..', 'resources', 'menu.html'), 'utf8');
        const output = homePage
            .replace("{{swagger.json}}", `${req.originalUrl}/swagger.json`)
            .replace("{{swagger.yaml}}", `${req.originalUrl}/swagger.yaml`)
            .replace("{{redocly}}", `${req.originalUrl}/redocly`)
            .replace("{{swagger}}", `${req.originalUrl}/swagger`);
        res.send(output);
    });
    return router;
}
