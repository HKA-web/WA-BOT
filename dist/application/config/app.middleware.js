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
// Middleware untuk cek apakah nomor terdaftar di WhatsApp
export async function ensureRegisteredWA(req, res, next) {
    try {
        const sock = waController.getSocket();
        if (!sock) {
            return res.status(500).json({ error: "Socket WA belum siap" });
        }
        let jids = [];
        if (Array.isArray(req.body)) {
            jids = req.body.map((item) => item.jid).filter(Boolean);
        }
        else if (req.body.jid) {
            jids = [req.body.jid];
        }
        else if (req.query.jid) {
            jids = [req.query.jid.toString()];
        }
        if (jids.length === 0) {
            return res.status(400).json({ error: "Nomor (jid) wajib disediakan" });
        }
        const flat = [];
        for (const jid of jids) {
            if (jid.endsWith("@s.whatsapp.net")) {
                // nomor personal
                const results = await sock.onWhatsApp(jid) || [];
                const result = results[0];
                flat.push({ jid, exists: result?.exists ?? false, type: "user" });
            }
            else if (jid.endsWith("@g.us")) {
                // group
                try {
                    await sock.groupMetadata(jid);
                    flat.push({ jid, exists: true, type: "group" });
                }
                catch {
                    flat.push({ jid, exists: false, type: "group" });
                }
            }
            else if (jid.endsWith("@c.us")) {
                // format khusus (misalnya dari WA Business API)
                flat.push({ jid, exists: true, type: "business" });
            }
            else {
                // format tidak dikenali
                flat.push({ jid, exists: false, type: "unknown" });
            }
        }
        req.waUsers = flat;
        next();
    }
    catch (err) {
        console.error("Error cek nomor:", err);
        res.status(500).json({ error: "Gagal cek nomor WA" });
    }
}
