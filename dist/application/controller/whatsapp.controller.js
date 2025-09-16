import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, proto } from "@whiskeysockets/baileys";
import pino from "pino";
import chalk from "chalk";
import qrcode from "qrcode-terminal";
import { Logger, question } from "../helper/app.helper.js";
//import mainHandler from "../main.js"; // handler utama pesan masuk
export class WhatsAppController {
    constructor() {
        this.sock = null;
    }
    // Dapatkan socket
    getSocket() {
        return this.sock;
    }
    async init() {
        const { state, saveCreds } = await useMultiFileAuthState("./session");
        const { version } = await fetchLatestBaileysVersion();
        let usePairingCode = false;
        if (!state.creds.me) {
            const choice = (await question("Pilih metode (1=QR, 2=Kode): ")).trim();
            usePairingCode = choice === "2";
        }
        this.sock = makeWASocket({
            logger: pino({ level: "silent" }),
            auth: state,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            version,
            generateHighQualityLinkPreview: true,
            getMessage: async () => new proto.Message({ conversation: "" }),
        });
        // Simpan kredensial saat update
        this.sock.ev.on("creds.update", saveCreds);
        // Handle koneksi
        this.sock.ev.on("connection.update", (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr && !usePairingCode) {
                console.log(chalk.cyan("📌 Scan QR berikut untuk login:"));
                qrcode.generate(qr, { small: true });
                console.log("QR Code URL:", `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}`);
            }
            if (connection === "open") {
                Logger.info("WhatsApp connected successfully");
            }
            if (connection === "close") {
                let reason;
                if (lastDisconnect?.error) {
                    // type guard
                    if (lastDisconnect.error.output) {
                        reason = lastDisconnect.error.output.statusCode;
                    }
                    else {
                        reason = undefined;
                    }
                    Logger.error(`Connection closed, reason: ${reason}`);
                }
                if (reason !== DisconnectReason.loggedOut) {
                    Logger.info("Reconnecting...");
                    setTimeout(() => this.init(), 5000);
                }
                else {
                    Logger.error("Logged out, delete session and scan QR again");
                }
            }
        });
        // Handle pesan masuk
        this.sock.ev.on("messages.upsert", async (m) => {
            const msg = m.messages[0];
            if (!msg || !msg.message)
                return;
            const body = msg.message.extendedTextMessage?.text ??
                msg.message.conversation ??
                msg.message.imageMessage?.caption ??
                msg.message.videoMessage?.caption ??
                msg.message.buttonsResponseMessage?.selectedButtonId ??
                msg.message.templateButtonReplyMessage?.selectedId ??
                msg.message.listResponseMessage?.singleSelectReply?.selectedRowId ??
                msg.message.locationMessage?.name ??
                "";
            const sender = msg.key.remoteJid;
            const pushname = msg.pushName || "User";
            const colors = ["red", "green", "yellow", "magenta", "cyan", "white", "blue"];
            const color = colors[Math.floor(Math.random() * colors.length)];
            console.log(chalk.yellow.bold("Credit : Lenwy"), chalk.green.bold("[ WhatsApp ]"), chalk[color](pushname), chalk[color](":"), chalk.gray("DEBUG raw message:"), JSON.stringify(msg.message, null, 2));
            // Panggil handler utama
            //await mainHandler(this.sock!, m);
        });
    }
    async sendMessage(jid, message) {
        if (!this.sock)
            throw new Error("WhatsApp not connected");
        const msg = { text: message };
        await this.sock.sendMessage(jid, msg);
        Logger.info(`Message sent to ${jid}`);
    }
}
