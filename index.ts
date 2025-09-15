import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { AppConfig } from "./application/config/app.config.js";
import { Logger } from "./application/helper/app.helper.js";
import { waController, ensureWA } from "./application/config/app.middleware.js";
import { setupApiDocs } from "./application/model/init.js";

const app = express();

// Init WhatsApp
waController.init().catch((err: unknown) => {
    if (err instanceof Error) Logger.error(err.message);
    else Logger.error(JSON.stringify(err));
});

app.use(express.json());

// Load Swagger JSON
const swaggerDocument = JSON.parse(fs.readFileSync("./application/view/init.json", "utf8"));

// Swagger UI
app.use(AppConfig.swaggerPath, swaggerUi.serve);
app.get(AppConfig.swaggerPath, (req, res, next) => {
    swaggerUi.setup(swaggerDocument)(req, res, next);
});

// Setup API routes
setupApiDocs(app);

// Start server
app.listen(AppConfig.port, () => {
    Logger.info(`Server running at http://localhost:${AppConfig.port}`);
    Logger.info(`Swagger docs at http://localhost:${AppConfig.port}${AppConfig.swaggerPath}`);
    Logger.info(`Check whatsapp session...`);
});
