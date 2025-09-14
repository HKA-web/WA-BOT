import fs from "fs";
import { sleep } from "./helper.js";
import "./len.js";
export default async function lenwyHandler(lenwy, m) {
    const maxLength = 4000; // batas karakter per pesan
    const maxBatch = 30; // batas batch
    const limit = 3; //batas limit
    const msg = m.messages[0];
    if (!msg.message)
        return;
    const body = msg.message.conversation
        || msg.message.extendedTextMessage?.text
        || (msg.message.locationMessage ? JSON.stringify(msg.message.locationMessage) : '')
        || '';
    const contextInfo = msg.message?.extendedTextMessage?.contextInfo
        || msg.message?.imageMessage?.contextInfo
        || msg.message?.videoMessage?.contextInfo
        || msg.message?.buttonsResponseMessage?.contextInfo
        || msg.message?.listResponseMessage?.contextInfo
        || msg.message?.locationMessage?.contextInfo
        || msg.message?.documentMessage?.contextInfo
        || null;
    const sender = msg.key.remoteJid;
    const pushname = msg.pushName || `Lenwy`;
    const admin = []; // daftar JID admin
    const lenwyreply = (teks) => lenwy.sendMessage(sender, { text: teks }, { quoted: msg });
    const isGroup = sender?.endsWith('@g.us') || false;
    const isAdmin = admin.includes(sender);
    const image = "./images/menu.jpeg";
    const menuImage = fs.readFileSync(image);
    if (body.toLowerCase() === "ping") {
        await sleep(3000); //jeda
        lenwy.sendMessage(sender, { text: "pong!" });
    }
    if (body.toLowerCase() == `menu`) {
        await lenwy.sendMessage(sender, {
            image: menuImage,
            caption: menu,
            mentions: [sender]
        }, { quoted: msg });
    }
}
