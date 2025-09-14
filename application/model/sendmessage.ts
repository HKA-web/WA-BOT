import { Express, Request, Response } from "express";
import { waController, ensureWA, ensureRegisteredWA } from "../config/app.middleware.js";
import { AnyMessageContent } from "@whiskeysockets/baileys";

export function sendMessage(app: Express) {
    app.post("/send-messages", ensureWA, ensureRegisteredWA, async (req: Request, res: Response) => {
        const sock = waController.getSocket()!;
        const waUsers = (req as any).waUsers as { jid: string; exists: boolean }[];

        const results: any[] = [];

        for (const user of waUsers) {
            const msg = Array.isArray(req.body)
                ? req.body.find((m: any) => m.jid === user.jid)
                : req.body;

            if (!msg || !msg.message) {
                results.push({
                    jid: user.jid,
                    status: "error",
                    error: "Field 'message' wajib"
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
                await sock.sendMessage(user.jid, { text: msg.message });
                results.push({ jid: user.jid, status: "success" });
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

