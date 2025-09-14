import { Express, Request, Response } from "express";
import { getSocket } from "../src/whatsapp.js";
import { ensureWA } from "../middleware/connectwhatsapp.js";
import { isRegistered } from "../middleware/registeredwhatsapp.js";

export function sendMessage(app: Express) {
  /**
   * @openapi
   * /send-message:
   *   post:
   *     tags:
   *       - WhatsApp Bot
   *     summary: Kirim pesan WhatsApp ke banyak nomor
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               messages:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     number:
   *                       type: string
   *                       description: Nomor WA tujuan (format 628xxx)
   *                     text:
   *                       type: string
   *                       description: Pesan yang akan dikirim
   *     responses:
   *       200:
   *         description: Hasil pengiriman pesan per nomor
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   number:
   *                     type: string
   *                   success:
   *                     type: boolean
   *                   message:
   *                     type: string
   *                   error:
   *                     type: string
   */
  app.post("/send-message", ensureWA, async (req: Request, res: Response) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Array messages dibutuhkan" });
    }

    const sock = getSocket();
    if (!sock) return res.status(500).json({ error: "Socket WA belum siap" });

    const results = await Promise.all(
      messages.map(async (item: { number: string; text: string }) => {
        const { number, text } = item;

        if (!number || !text) return { number, success: false, error: "Nomor atau text kosong" };

        try {
          // Cek apakah nomor terdaftar WA
          const registered = await isRegistered(number);
          if (!registered) return { number, success: false, error: "Nomor tidak terdaftar WA" };

          await sock.sendMessage(`${number}@s.whatsapp.net`, { text });
          return { number, success: true, message: text };
        } catch (err: any) {
          console.error(`Gagal kirim ke ${number}:`, err.message || err);
          return { number, success: false, error: err.message || "Gagal kirim pesan" };
        }
      })
    );

    return res.json(results);
  });
}
