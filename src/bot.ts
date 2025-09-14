import express, { Request, Response } from "express";
import { connectToWhatsApp, getSocket } from "./whatsapp.js";
import { setupApiDocs } from "../api-docs/index.js";

export async function startBotServer() {
  // Hubungkan ke WhatsApp
  await connectToWhatsApp();

  const app = express();
  app.use(express.json());

  setupApiDocs(app);

  app.listen(3000, () => {
    console.log("Bot internal API jalan di http://localhost:3000");
  });
}
