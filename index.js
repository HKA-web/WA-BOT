/*  

  Made By Lenwy
  Base : Lenwy
  WhatsApp : wa.me/6283829814737
  Telegram : t.me/ilenwy
  Youtube : @Lenwy

  Channel : https://whatsapp.com/channel/0029VaGdzBSGZNCmoTgN2K0u

  Copy Code?, Recode?, Rename?, Reupload?, Reseller? Taruh Credit Ya :D

  Mohon Untuk Tidak Menghapus Watermark Di Dalam Kode Ini

*/

// Import Module 
const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("baileys")
const pino = require("pino")
const chalk = require("chalk")
const readline = require("readline")
const { resolve } = require("path")
const { version } = require("os")
const qrcode = require("qrcode-terminal")

// helper untuk input nomor di terminal
const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise((resolve) =>
    rl.question(text, (ans) => {
      rl.close()
      resolve(ans)
    })
  )
}

// setting: kalau true maka pairing pakai code, kalau false maka scan QR
let usePairingCode = false;

async function index() {
  try {
    console.log("\Metode Pairing:");
    console.log("1. QR");
    console.log("2. Kode");

    // 🔥 di sini pakai await
    const choice = (await question("Plih (1 or 2): ")).trim();

    if (choice === "1") {
      usePairingCode = false; // QR pakai scan
      await connectToWhatsApp();
    } else if (choice === "2") {
      usePairingCode = true; // pairing code
      await connectToWhatsApp();
    } else {
      console.log("❌ Tidak sesuai, pilih 1 atau 2.");
      await index(); // ulangi prompt lagi
    }
  } catch (err) {
    console.error("⚠️ Gagal Tersambung code:", err);
  }
}

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("./LenwySesi")

  const { version, isLatest } = await fetchLatestBaileysVersion()
  console.log(`Lenwy Using WA v${version.join(".")}, isLatest: ${isLatest}`)
  let isqr = usePairingCode ? !true : usePairingCode;
  
  const lenwy = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: isqr,
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    version: version,
    syncFullHistory: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      return proto.Message.fromObject({})
    }
  })
	
  // Mode QR Code
  if (!usePairingCode && !lenwy.authState.creds.registered) {
    lenwy.ev.on("connection.update", (update) => {
      const { qr } = update
      if (qr) {
        console.log(chalk.cyan("📌 Scan QR berikut untuk login:"))
        qrcode.generate(qr, { small: true })
		console.log("QR Code URL:", `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}`)
      }
    })
  }

  // Mode Pairing Code
  if (usePairingCode && !lenwy.authState.creds.registered) {
    try {
      const phoneNumber = await question("☘️ Masukan Nomor Yang Diawali Dengan 62:\n")
      const code = await lenwy.requestPairingCode(phoneNumber.trim())
      console.log(chalk.green(`🎁 Pairing Code : ${code}`))
    } catch (err) {
      console.error("Failed to get pairing code:", err)
    }
  }

  // Menyimpan sesi
  lenwy.ev.on("creds.update", saveCreds)

  // Info koneksi
  lenwy.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update
    if (connection === "close") {
      console.log(chalk.red("❌  Koneksi Terputus, Mencoba Menyambung Ulang"))
      connectToWhatsApp()
    } else if (connection === "open") {
      console.log(chalk.green("✔  Bot Berhasil Terhubung Ke WhatsApp"))
    }
  })

  // Respon pesan masuk
  lenwy.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0]
    if (!msg.message) return

    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""
    const sender = msg.key.remoteJid
    const pushname = msg.pushName || "Lenwy"

    // log pesan
    const listColor = ["red", "green", "yellow", "magenta", "cyan", "white", "blue"]
    const randomColor = listColor[Math.floor(Math.random() * listColor.length)]

    console.log(
      chalk.yellow.bold("Credit : Lenwy"),
      chalk.green.bold("[ WhatsApp ]"),
      chalk[randomColor](pushname),
      chalk[randomColor](" : "),
      chalk.white(body)
    )

    require("./lenwy")(lenwy, m)
  })
}

index()