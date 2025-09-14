import { WhatsAppController } from "../controller/whatsapp.controller.js";
// Buat 1 instance global yang sama
export const waController = new WhatsAppController();
// Middleware memastikan WA siap
export async function ensureWA(req, res, next) {
    const sock = waController.getSocket();
    if (!sock)
        return res.status(500).json({ error: "Socket WA belum siap" });
    next();
}
