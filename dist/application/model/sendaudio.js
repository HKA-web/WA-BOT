import { waController, ensureWA, ensureRegisteredWA } from "../config/app.middleware.js";
import multer from "multer";
import axios from "axios";
import { sleep } from "../helper/app.helper.js";
// konfigurasi multer (simpan file di memori)
const upload = multer({ storage: multer.memoryStorage() });
export function sendAudio(app) {
    app.post("/send-audios", ensureWA, ensureRegisteredWA, upload.single("audio"), // file upload opsional
    async (req, res) => {
        const sock = waController.getSocket();
        if (!sock || !sock.user) {
            return res.status(500).json({ error: "WhatsApp socket belum siap" });
        }
        const waUsers = req.waUsers;
        const results = [];
        // body bisa array JSON atau single object
        const bodyArray = Array.isArray(req.body) ? req.body : [req.body];
        for (const user of waUsers) {
            const msg = bodyArray.find((m) => m.jid === user.jid);
            if (!msg && !req.file) {
                results.push({
                    jid: user.jid,
                    status: "error",
                    error: "Wajib menyertakan 'audioUrl' atau upload file 'audio'"
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
                let buffer;
                // 1️⃣ File upload via multipart
                if (req.file) {
                    buffer = req.file.buffer;
                    await sock.sendMessage(user.jid, {
                        audio: buffer,
                        mimetype: req.file.mimetype, // pakai mimetype hanya untuk upload file
                        ptt: msg?.ptt ?? false
                    });
                    // 2️⃣ Audio URL
                }
                else {
                    const url = msg.audioUrl || msg.audio;
                    if (!url)
                        throw new Error("Tidak ada audio yang tersedia");
                    const response = await axios.get(url, { responseType: "arraybuffer" });
                    buffer = Buffer.from(response.data, "binary");
                    await sock.sendMessage(user.jid, {
                        audio: buffer,
                        ptt: msg?.ptt ?? false // mimetype dikosongkan supaya WA auto detect
                    });
                }
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
