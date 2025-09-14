// src/wa.ts
import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  proto,
  WASocket,
  ConnectionState
} from "@whiskeysockets/baileys";
import pino from "pino";
import chalk from "chalk";
import qrcode from "qrcode-terminal";
import { question } from "./helper.js";
import mainHandler from "./main.js";

const logger = pino({ level: "silent" });

// Socket global
let sock: WASocket | null = null;

// Fungsi untuk mengembalikan socket
export function getSocket(): WASocket | null {
  return sock;
}

// Fungsi untuk connect ke WhatsApp
export async function connectToWhatsApp(): Promise<void> {
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version } = await fetchLatestBaileysVersion();

  let usePairingCode = false;

  if (state.creds.me === undefined) {
    const choice = (await question("Pilih metode (1=QR, 2=Kode): ")).trim();
    usePairingCode = choice === "2";
  }

  sock = makeWASocket({
    logger,
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    version,
    generateHighQualityLinkPreview: true,
    getMessage: async () => new proto.Message({ conversation: "" }),
  });

  // Simpan kredensial saat update
  sock.ev.on("creds.update", saveCreds);

  // Handle koneksi
  sock.ev.on("connection.update", (update: Partial<ConnectionState>) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !usePairingCode) {
      console.log(chalk.cyan("📌 Scan QR berikut untuk login:"));
      qrcode.generate(qr, { small: true });
      console.log(
        "QR Code URL:",
        `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}`
      );
    }

    if (connection === "open") {
      console.log(chalk.green("✔ Bot berhasil terhubung ke WhatsApp"));
    }

    if (connection === "close") {
      console.log(chalk.red("❌ Koneksi terputus"));

      // Log error jika ada
      if (lastDisconnect?.error) {
        console.error("❌ Detail disconnect:", lastDisconnect.error);
      }

      // Hapus socket lama
      sock = null;

      // Reconnect setelah delay
      setTimeout(async () => {
        try {
          console.log("♻️ Mencoba reconnect...");
          await connectToWhatsApp();
        } catch (err) {
          console.error("❌ Gagal reconnect:", err);
        }
      }, 5000);
    }
  });

  // Handle pesan masuk
  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg || !msg.message) return;

    // Ambil isi pesan dari berbagai tipe
    const body: string =
      msg.message.extendedTextMessage?.text ??
      msg.message.conversation ??
      msg.message.imageMessage?.caption ??
      msg.message.videoMessage?.caption ??
      msg.message.buttonsResponseMessage?.selectedButtonId ??
      msg.message.templateButtonReplyMessage?.selectedId ??
      msg.message.listResponseMessage?.singleSelectReply?.selectedRowId ??
      msg.message.locationMessage?.name ??
      "";

    const sender = msg.key.remoteJid;
    const pushname: string = msg.pushName || "User";

    // Warna log random
    const listColor = ["red", "green", "yellow", "magenta", "cyan", "white", "blue"] as const;
    const randomColor = listColor[Math.floor(Math.random() * listColor.length)];

    // Log ke terminal
    console.log(
      chalk.yellow.bold("Credit : Lenwy"),
      chalk.green.bold("[ WhatsApp ]"),
      chalk[randomColor](pushname),
      chalk[randomColor](":"),
      chalk.gray("DEBUG raw message:"), JSON.stringify(msg.message, null, 2)
    );

    // Panggil handler utama
    await mainHandler(sock!, m);
  });
}
