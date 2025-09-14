import { Express, Request, Response } from "express";
import { getSocket } from "../src/whatsapp.js";
import { ensureWA } from "../middleware/connectwhatsapp.js";
import { isRegistered } from "../middleware/registeredwhatsapp.js";

export function sendImageMessage(app: Express) {
  /**
   * @openapi
   * /send-image:
   *   post:
   *     tags:
   *       - WhatsApp Bot
   *     summary: Kirim pesan bergambar WhatsApp ke banyak nomor
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
   *                     caption:
   *                       type: string
   *                       description: Pesan teks sebagai caption gambar
   *                     imageUrl:
   *                       type: string
   *                       description: URL gambar yang akan dikirim
   *     responses:
   *       200:
   *         description: Hasil pengiriman gambar per nomor
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
   *                   caption:
   *                     type: string
   *                   imageUrl:
   *                     type: string
   */
  app.post("/send-image", ensureWA, async (req: Request, res: Response) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Array messages dibutuhkan" });
    }

    const sock = getSocket();
    if (!sock) return res.status(500).json({ error: "Socket WA belum siap" });

    const results = await Promise.all(
      messages.map(async (item: { number: string; caption: string; imageUrl: string }) => {
        const { number, caption, imageUrl } = item;

        if (!number || !imageUrl) return { number, success: false, error: "Nomor atau imageUrl kosong" };

        try {
          const registered = await isRegistered(number);
          if (!registered) return { number, success: false, error: "Nomor tidak terdaftar WA" };

          await sock.sendMessage(`${number}@s.whatsapp.net`, {
            image: { url: imageUrl },
            caption: caption || "",
          });

          return { number, success: true, caption: caption || "", imageUrl };
        } catch (err: any) {
          console.error(`Gagal kirim gambar ke ${number}:`, err.message || err);
          return { number, success: false, error: err.message || "Gagal kirim pesan" };
        }
      })
    );

    return res.json(results);
  });
}
