"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./index"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use('/', (0, index_1.default)(path_1.default.join(__dirname, '..', 'resources', 's.json')));
app.listen(3000);
console.log("server running on http://localhost:3000");
