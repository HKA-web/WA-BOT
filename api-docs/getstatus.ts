import { Express, Request, Response } from "express";
import { ensureWA } from "../middleware/connectwhatsapp.js";

export function ping(app: Express) {
  /**
   * @openapi
   * /ping:
   *   get:
   *     tags:
   *       - WhatsApp Bot
   *     summary: Cek status server / ping
   *     responses:
   *       200:
   *         description: Server merespon ping
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 time:
   *                   type: string
   *       500:
   *         description: Server tidak merespon
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  app.get("/ping", ensureWA, async (req: Request, res: Response) => {
    res.json({ status: "pong", time: new Date().toISOString() });
  });
}