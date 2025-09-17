import { waController, ensureWA, ensureRegisteredWA } from "../config/app.middleware.js";
import { sendChunk, sleep } from "../helper/app.helper.js";
export function sendMessage(app) {
    app.post("/send-messages", ensureWA, ensureRegisteredWA, async (req, res) => {
        const sock = waController.getSocket();
        const waUsers = req.waUsers;
        const results = [];
        for (const user of waUsers) {
            const msg = Array.isArray(req.body)
                ? req.body.find((m) => m.jid === user.jid)
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
                await sendChunk(String(msg.message).replace(/\\n/g, "\n"), async (batchText) => {
                    await sock.sendMessage(user.jid, { text: batchText });
                });
                results.push({ jid: user.jid, status: "success" });
                await sleep();
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
