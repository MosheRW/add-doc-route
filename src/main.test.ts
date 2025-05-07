import path from "path";
import addDocsRoute from "./index";
import express from "express";

const app = express();
app.use('/', addDocsRoute(path.join(__dirname, '..', 'resources', 'swagger.json')));
app.listen(3000);
console.log("server running on http://localhost:3000");