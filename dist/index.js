import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, proto } from "@whiskeysockets/baileys";
import pino from "pino";
import chalk from "chalk";
import qrcode from "qrcode-terminal";
import { question } from "./helper.js";
import lenwyHandler from "./lenwy.js";
const logger = pino({ level: "silent" });
// setting: kalau true maka pairing pakai code, kalau false maka scan QR
let usePairingCode = false;
async function pairing() {
    try {
        console.log("Metode Pairing:");
        console.log("1. QR");
        console.log("2. Kode");
        const choice = (await question("Pilih (1 or 2): ")).trim();
        if (choice === "1") {
            usePairingCode = false;
        }
        else if (choice === "2") {
            usePairingCode = true;
        }
        else {
            console.log("? Tidak sesuai, pilih 1 atau 2.");
        }
    }
    catch (err) {
        console.error("?? Gagal Tersambung code:", err);
    }
}
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("./LenwySesi");
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`Lenwy Using WA v${version.join(".")}, isLatest: ${isLatest}`);
    if (state.creds.me !== undefined) {
        console.log(chalk.green("✔ Session sudah ready, langsung konek..."));
    }
    else {
        await pairing();
    }
    //let isqr = usePairingCode ? !true : usePairingCode;
    let isqr = !usePairingCode; // true kalau QR mode, false kalau pairing code
    const lenwy = makeWASocket({
        logger: logger,
        printQRInTerminal: isqr,
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        version,
        syncFullHistory: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            return new proto.Message({
                conversation: ""
            });
        }
    });
    // Mode QR Code
    if (!usePairingCode && !lenwy.authState.creds.registered) {
        lenwy.ev.on("connection.update", (update) => {
            const { qr } = update;
            if (qr) {
                console.log(chalk.cyan("📌 Scan QR berikut untuk login:"));
                qrcode.generate(qr, { small: true });
                console.log("QR Code URL:", `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}`);
            }
        });
    }
    // Mode Pairing Code
    if (usePairingCode && !lenwy.authState.creds.registered) {
        try {
            const phoneNumber = await question("☘️ Masukan Nomor Yang Diawali Dengan 62:\n");
            const code = await lenwy.requestPairingCode(phoneNumber.trim());
            console.log(chalk.green(`🎁 Pairing Code : ${code}`));
        }
        catch (err) {
            console.error("Failed to get pairing code:", err);
        }
    }
    // Menyimpan sesi
    lenwy.ev.on("creds.update", saveCreds);
    // Info koneksi
    lenwy.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            console.log(chalk.red("❌  Koneksi Terputus, Mencoba Menyambung Ulang"));
            connectToWhatsApp();
        }
        else if (connection === "open") {
            console.log(chalk.green("✔  Bot Berhasil Terhubung Ke WhatsApp"));
        }
    });
    // Respon pesan masuk
    lenwy.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message)
            return;
        const body = msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            msg.message.locationMessage?.name ||
            "";
        const sender = msg.key.remoteJid;
        const pushname = msg.pushName || "Lenwy";
        const listColor = ["red", "green", "yellow", "magenta", "cyan", "white", "blue"];
        const randomColor = listColor[Math.floor(Math.random() * listColor.length)];
        console.log(chalk.yellow.bold("Credit : Lenwy"), chalk.green.bold("[ WhatsApp ]"), chalk[randomColor](pushname), chalk[randomColor](" : "), chalk.white(body));
        await lenwyHandler(lenwy, m);
    });
}
connectToWhatsApp();
