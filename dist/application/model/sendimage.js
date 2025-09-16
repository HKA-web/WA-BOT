import { waController, ensureWA, ensureRegisteredWA } from "../config/app.middleware.js";
import { sleep } from "../helper/app.helper.js";
export function sendImage(app) {
    app.post("/send-images", ensureWA, ensureRegisteredWA, async (req, res) => {
        const sock = waController.getSocket();
        const waUsers = req.waUsers;
        const results = [];
        for (const user of waUsers) {
            const msg = Array.isArray(req.body)
                ? req.body.find((m) => m.jid === user.jid)
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
                let imageContent;
                if (msg.image.startsWith("data:image")) {
                    // Base64 → convert ke Buffer
                    const base64Data = msg.image.split(",")[1];
                    imageContent = Buffer.from(base64Data, "base64");
                }
                else if (msg.image.startsWith("http://") || msg.image.startsWith("https://")) {
                    // URL
                    imageContent = { url: msg.image };
                }
                else {
                    // Anggap path lokal
                    imageContent = { url: msg.image };
                }
                await sock.sendMessage(user.jid, {
                    image: imageContent,
                    caption: msg.caption || ""
                });
                results.push({ jid: user.jid, status: "success" });
                await sleep(500);
            }
            catch (err) {
                results.push({
                    jid: user.jid,
                    status: "error",
                    error: err.message
                });
            }
        }
        res.json({ results });
    });
}
