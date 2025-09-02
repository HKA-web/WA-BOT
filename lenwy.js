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
require('./len')
require('./database/Menu/LenwyMenu')
const fs = require('fs');
const axios = require('axios');
const { downloadContentFromMessage } = require("baileys");
const sharp = require('sharp');
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

// Pastikan folder tmp ada
if (!fs.existsSync("./tmp")) fs.mkdirSync("./tmp");

// Import Scrape
const Ai4Chat = require('./scrape/Ai4Chat');
const tiktok2 = require('./scrape/Tiktok');
const youtube = require('./scrape/YouTube');
const zenquotes = require('./scrape/Quote');
const usetubes = require('./scrape/UseTube');
const XLSX = require("xlsx");

module.exports = async (lenwy, m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    const sender = msg.key.remoteJid;
    const pushname = msg.pushName || "Lenwy";
    const args = body.slice(1).trim().split(" ");
    const command = args.shift().toLowerCase();
    const q = args.join(" ");

    if (!body.startsWith(prefix)) return;

    const lenwyreply = (teks) => lenwy.sendMessage(sender, { text: teks }, { quoted: msg });
    const isGroup = sender.endsWith('@g.us');
    const isAdmin = (admin.includes(sender))
    const menuImage = fs.readFileSync(image);

// Fungsi broadcast
async function broadcast(data, quotedMsg) {
    for (let row of data) {
        try {
            await lenwy.sendMessage(
                row.phone + '@s.whatsapp.net',
                { text: row.message },
                { quoted: quotedMsg }
            );
        } catch (e) {
            console.error(`Gagal mengirim ke ${row.phone}:`, e);
        }
        // Delay kecil agar tidak terblokir
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

// Fungsi helper download media
async function downloadMedia(message, type) {
    try {
        const stream = await downloadContentFromMessage(message, type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    } catch (err) {
        console.error("Gagal download media:", err);
        throw err;
    }
}

switch (command) {

// Menu
case "menu": {
    await lenwy.sendMessage(sender,
        {
            image: menuImage,
            caption: lenwymenu,
            mentions: [sender]
        },
    { quoted: msg }
    )
}
break

// Hanya Admin
case "admin": {
    if (!isAdmin) return lenwyreply(mess.admin); // COntoh Penerapan Hanya Admin
    lenwyreply("🎁 *Kamu Adalah Admin*"); // Admin Akan Menerima Pesan Ini
}
break

// Hanya Group
case "group": {
    if (!isGroup) return lenwyreply(mess.group); // Contoh Penerapan Hanya Group
    lenwyreply("🎁 *Kamu Sedang Berada Di Dalam Grup*"); // Pesan Ini Hanya Akan Dikirim Jika Di Dalam Grup
}
break

// AI Chat
case "ai": {
    if (!q) return lenwyreply("☘️ *Contoh:* !ai Apa itu JavaScript?");
        lenwyreply(mess.wait);
    try {
        const lenai = await Ai4Chat(q);
            await lenwyreply(`*Begini Penjelasan nya wahai madesu*\n\n${lenai}`);
                } catch (error) {
            console.error("Error:", error);
        lenwyreply(mess.error);
    }
}
break;

case "ttdl": {
    if (!q) return lenwyreply("⚠ *Mana Link Tiktoknya?*");
        lenwyreply(mess.wait);
    try {
        const result = await tiktok2(q); // Panggil Fungsi Scraper

            // Kirim Video
            await lenwy.sendMessage(
                sender,
                    {
                        video: { url: result.no_watermark },
                        caption: `*🎁 Lenwy Tiktok Downloader*`
                    },
                { quoted: msg }
            );

        } catch (error) {
            console.error("Error TikTok DL:", error);
        lenwyreply(mess.error);
    }
}
break;

case "igdl": {
    if (!q) return lenwyreply("⚠ *Mana Link Instagramnya?*");
    try {
        lenwyreply(mess.wait);

        // Panggil API Velyn
        const apiUrl = `https://www.velyn.biz.id/api/downloader/instagram?url=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.status || !response.data.data.url[0]) {
            throw new Error("Link tidak valid atau API error");
        }

        const data = response.data.data;
        const mediaUrl = data.url[0];
        const metadata = data.metadata;

        // Kirim Media
        if (metadata.isVideo) {
            await lenwy.sendMessage(
                sender,
                    {
                        video: { url: mediaUrl },
                        caption: `*Instagram Reel*\n\n` +
                            `*Username :* ${metadata.username}\n` +
                            `*Likes :* ${metadata.like.toLocaleString()}\n` +
                            `*Comments :* ${metadata.comment.toLocaleString()}\n\n` +
                            `*Caption :* ${metadata.caption || '-'}\n\n` +
                            `*Source :* ${q}`
                    },
                    { quoted: msg }
                );
        } else {
            await lenwy.sendMessage(
                sender,
                    {
                        image: { url: mediaUrl },
                        caption: `*Instagram Post*\n\n` +
                            `*Username :* ${metadata.username}\n` +
                            `*Likes :* ${metadata.like.toLocaleString()}\n\n` +
                            `*Caption :* ${metadata.caption || '-'}`
                    },
                    { quoted: msg }
                );
            }

        } catch (error) {
            console.error("Error Instagram DL:", error);
        lenwyreply(mess.error);
    }
}
break;

// Game Tebak Angka
case "tebakangka": {
    const target = Math.floor(Math.random() * 100);
        lenwy.tebakGame = { target, sender };
    lenwyreply("*Tebak Angka 1 - 100*\n*Ketik !tebak [Angka]*");
}
break;

case "tebak": {
    if (!lenwy.tebakGame || lenwy.tebakGame.sender !== sender) return;
        const guess = parseInt(args[0]);
    if (isNaN(guess)) return lenwyreply("❌ *Masukkan Angka!*");

    if (guess === lenwy.tebakGame.target) {
        lenwyreply(`🎉 *Tebakkan Kamu Benar!*`);
            delete lenwy.tebakGame;
        } else {
            lenwyreply(guess > lenwy.tebakGame.target ? "*Terlalu Tinggi!*" : "*Terlalu rendah!*");
    }
}
break;

case "quote": {
    lenwyreply(mess.wait);
    try {
        const quote = await zenquotes();
        await lenwyreply(`${quote.quote} — ${quote.author}`);
    } catch (error) {
        console.error("Error:", error);
        lenwyreply(mess.error);
    }
}
break;

case "broadcast": {
    try {
        const workbook = XLSX.readFile("broadcast.xlsx");
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Panggil fungsi broadcast
        await broadcast(data, msg);

        lenwyreply("✅ Broadcast selesai!");
    } catch (err) {
        console.error(err);
        lenwyreply(mess.error);
    }
}
break;

case "example": {
	const data = [];
    if (!q) return lenwyreply("☘️ *Contoh:* !example pemrograman?");
        lenwyreply(mess.wait);
	try {
		const response = await usetubes(q);
		let data = [];
		for (let row of response) {
			data.push(`*Title:* ${row.title}\n*URL:* https://www.youtube.com/watch?v=${row.id}\n*Publish:* ${row.publishedAt}`);
		}
		const result = data.join("\n\n"); // kasih jarak antar item
		await lenwyreply(result);
	} catch (error) {
		console.error("Error:", error);
		lenwyreply(mess.error);
	}
}
break;

case "yt": {
    if (!q) return lenwyreply("☘️ *Contoh:* !yt pemrograman?");
    lenwyreply(mess.wait);
    try {
        const response = await usetubes(q);
		let count = 0;
        for (let row of response) {
			if (count >= 3) break;
            await lenwy.sendMessage(sender, {
                text: row.title,
                contextInfo: {
                    externalAdReply: {
                        title: row.title,
                        body: row.channelTitle || "YouTube",
                        mediaType: 2,
                        mediaUrl: `https://www.youtube.com/watch?v=${row.id}`,
                        sourceUrl: `https://www.youtube.com/watch?v=${row.id}`,
                        renderLargerThumbnail: true
                    }
                }
            });
			count++;
			 // ✅ Delay antar pesan (3 detik misalnya)
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    } catch (error) {
        console.error("Error:", error);
        lenwyreply(mess.error);
    }
	lenwyreply("✅ Pencarian Selesai!");
}
break;

case "stiker": {
    const { extendedTextMessage } = msg.message || {};

    if (
        !extendedTextMessage ||
        !extendedTextMessage.contextInfo ||
        !extendedTextMessage.contextInfo.quotedMessage ||
        (!extendedTextMessage.contextInfo.quotedMessage.imageMessage &&
         !extendedTextMessage.contextInfo.quotedMessage.videoMessage &&
         !extendedTextMessage.contextInfo.quotedMessage.documentMessage)
    ) {
        await lenwy.sendMessage(
            sender,
            { text: 'Reply gambar atau GIF/video dengan "!stiker" untuk dijadikan stiker.' },
            { quoted: msg }
        );
        break;
    }

    lenwyreply(mess.wait);

    const quotedMessage = extendedTextMessage.contextInfo.quotedMessage;
    let mediaBuffer;

    if (quotedMessage.imageMessage) {
        // Konversi image ke WebP
        mediaBuffer = await downloadMedia(quotedMessage.imageMessage, "image");
        mediaBuffer = await sharp(mediaBuffer)
            .resize(512, 512, { fit: "contain" })
            .webp({ quality: 100 })
            .toBuffer();
    } else if (quotedMessage.videoMessage || quotedMessage.documentMessage) {
        const isGIF = quotedMessage.documentMessage?.mimetype === "image/gif";
        const tempInput = `./tmp/input_${Date.now()}.${isGIF ? "gif" : "mp4"}`;
        const tempOutput = `./tmp/output_${Date.now()}.webp`;

        // Simpan buffer ke file sementara
        mediaBuffer = await downloadMedia(
            quotedMessage.videoMessage || quotedMessage.documentMessage,
            isGIF ? "document" : "video"
        );
        fs.writeFileSync(tempInput, mediaBuffer);

        // Konversi ke WebP pakai ffmpeg
        await new Promise((resolve, reject) => {
            ffmpeg(tempInput)
                .inputFormat(isGIF ? "gif" : "mp4")
                .outputOptions([
                    "-vcodec", "libwebp",
                    "-filter:v", "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,fps=15",
                    "-loop", "0",
                    "-preset", "default",
                    "-an",
                    "-vsync", "0"
                ])
                .toFormat("webp")
                .save(tempOutput)
                .on("end", resolve)
                .on("error", reject);
        });

        mediaBuffer = fs.readFileSync(tempOutput);

        // Hapus file sementara
        fs.unlinkSync(tempInput);
        fs.unlinkSync(tempOutput);
    }

    await lenwy.sendMessage(
        sender,
        { sticker: mediaBuffer },
        { quoted: msg }
    );
}
break;

case "ytdl": {
    if (!q) return lenwyreply("⚠ *Mana Link Youtube?*");
        lenwyreply(mess.wait);
	try {
		const result = await youtube(q);

		await lenwy.sendMessage(
			sender,
			{
				video: { url: result.requested_downloads[0].url },
				caption: `*🎁 Lenwy YouTube Downloader*\n\n${result.title} - (${result.requested_downloads[0].format_note})`
			},
			{ quoted: msg }
		);

	} catch (error) {
		console.error("Error Youtube DL:", error);
		lenwyreply(mess.error);
	}

}
break;

        default: { lenwyreply(mess.default) }
    }
}