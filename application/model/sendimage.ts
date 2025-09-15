import { Express, Request, Response } from "express";
import { waController, ensureWA, ensureRegisteredWA } from "../config/app.middleware.js";
import { sleep } from "../helper/app.helper.js";

export function sendImage(app: Express) {
    app.post("/send-images", ensureWA, ensureRegisteredWA, async (req: Request, res: Response) => {
        const sock = waController.getSocket()!;
        const waUsers = (req as any).waUsers as { jid: string; exists: boolean }[];

        const results: any[] = [];

        for (const user of waUsers) {
            const msg = Array.isArray(req.body)
                ? req.body.find((m: any) => m.jid === user.jid)
                : req.body;

            if (!msg || !msg.image) {
                results.push({
                    jid: user.jid,
                    status: "error",
                    error: "Field 'image' wajib (url/base64/path)"
                });
                continue;
            }

            if (!user.exists) {
                results.push({
                    jid: user.jid,
                    status: "error",
                    error: "Nomor tidak terdaftar di WhatsApp"
                });
                continue;
            }

            try {
                let imageContent: any;

                if (msg.image.startsWith("data:image")) {
                    // Base64 → convert ke Buffer
                    const base64Data = msg.image.split(",")[1];
                    imageContent = Buffer.from(base64Data, "base64");
                } else if (msg.image.startsWith("http://") || msg.image.startsWith("https://")) {
                    // URL
                    imageContent = { url: msg.image };
                } else {
                    // Anggap path lokal
                    imageContent = { url: msg.image };
                }

                await sock.sendMessage(user.jid, {
                    image: imageContent,
                    caption: msg.caption || ""
                });

                results.push({ jid: user.jid, status: "success" });
				await sleep(500);
            } catch (err: unknown) {
                results.push({
                    jid: user.jid,
                    status: "error",
                    error: (err as Error).message
                });
            }
        }

        res.json({ results });
    });
}
