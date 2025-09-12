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
const XLSX = require(`xlsx`);
const { downloadContentFromMessage } = require(`baileys`);
const sharp = require('sharp');
const path = require(`path`);
const ffmpeg = require(`fluent-ffmpeg`);
const ffmpegPath = require(`@ffmpeg-installer/ffmpeg`).path;
const dayjs = require(`dayjs`);
const isBetween = require(`dayjs/plugin/isBetween`);
const customParseFormat = require(`dayjs/plugin/customParseFormat`);
const timezone = require(`dayjs/plugin/timezone`);
const utc = require(`dayjs/plugin/utc`);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);


// Import Scrape
const Ai4Chat = require('./scrape/Ai4Chat');
const tiktok2 = require('./scrape/Tiktok');
const youtube = require('./scrape/YouTube');
const zenquotes = require('./scrape/Quote');
const usetubes = require('./scrape/UseTube');
const { getJadwalSholat, getQiblaDirection } = require('./scrape/Aladhan');
const { getLetter, getVerse } = require('./scrape/EQuran');
const openstreet = require('./scrape/OpenStreetMap');


module.exports = async (lenwy, m) => {
	const maxLength = 4000; // batas karakter per pesan
	const maxBatch = 30; // batas batch
	const limit = 3;
    const msg = m.messages[0];
    if (!msg.message) return;

    const body = msg.message.conversation 
    || msg.message.extendedTextMessage?.text 
    || (msg.message.locationMessage ? JSON.stringify(msg.message.locationMessage) : ``) 
    || ``;
    const sender = msg.key.remoteJid;
    const pushname = msg.pushName || `Lenwy`;
    const args = body.slice(1).trim().split(` `);
    const command = args.shift().toLowerCase();
    const q = args.join(` `);

    //if (!body.startsWith(prefix)) return;

    const lenwyreply = (teks) => lenwy.sendMessage(sender, { text: teks }, { quoted: msg });
    const isGroup = sender.endsWith('@g.us');
    const isAdmin = (admin.includes(sender))
    const menuImage = fs.readFileSync(image);
	
	const contextInfo = msg.message?.extendedTextMessage?.contextInfo 
			 || msg.message?.imageMessage?.contextInfo
			 || msg.message?.videoMessage?.contextInfo
			 || msg.message?.buttonsResponseMessage?.contextInfo
			 || msg.message?.listResponseMessage?.contextInfo
			 || msg.message?.locationMessage?.contextInfo
			 || msg.message?.documentMessage?.contextInfo
			 || null;
				 
	function sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms));
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
	
	async function sendInChunks(items, batchSize, maxLength, formatter, sendFunc, delayMs = 0) {
	  let buffer = [];
	  let bufferLength = 0;

	  for (let item of items) {
		const line = formatter(item); // format bebas via parameter
		const lineLength = line.length + 2; // +2 untuk "\n\n"

		if (buffer.length >= batchSize || (bufferLength + lineLength) > maxLength) {
		  await sendFunc(buffer.join("\n\n"));
		  buffer = [];
		  bufferLength = 0;
		  if (delayMs > 0) await sleep(delayMs); // jeda antar kirim
		}

		buffer.push(line);
		bufferLength += lineLength;
	  }

	  if (buffer.length > 0) {
		await sendFunc(buffer.join("\n\n"));
	  }
	}
	
	if (body.toLowerCase() == `menu`) {
		await lenwy.sendMessage(
			sender,{
				image: menuImage,
				caption: lenwymenu,
				mentions: [sender]
			},{ quoted: msg }
		)
	}
	
	if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
		const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;
		const quotedText = quoted.conversation 
                   || quoted.extendedTextMessage?.text 
                   || quoted.imageMessage?.caption 
                   || ``;
		if (quotedText.includes(`📋 MENU BOT`)) {
			switch (body) {
				case `1`:
					try {
						const sentMsg = await lenwy.sendMessage(
							sender,{
								text: '🤖 Tanya Apa?\n\nNavigasi:\n*99.* Kembali ke menu utama\n\n_Balas Pesan ini!_',
								mentions: [sender]
							},
							{ quoted: msg }
						)
						menuMessages.set(sentMsg.key.id, { param: 'ai' });
					} catch (err) {
						console.error(err);
						lenwyreply(mess.error);
					}
					break;
				case `2`:
					try {
						const sentMsg = await lenwy.sendMessage(
							sender,{
								text: '▶️ Mau Cari Video Apa?\n\nNavigasi:\n*99.* Kembali ke menu utama \n\n_Balas Pesan ini!_',
								mentions: [sender]
							},
							{ quoted: msg }
						)
						menuMessages.set(sentMsg.key.id, { param: 'yt' });
					} catch (err) {
						console.error(err);
						lenwyreply(mess.error);
					}
					break;
				case `3`:
					try {
						const sentMsg = await lenwy.sendMessage(
							sender,{
								text: '🎵 Link Video Tiktok?\n\nNavigasi:\n*99.* Kembali ke menu utama \n\n_Balas Pesan ini!_',
								mentions: [sender]
							},
							{ quoted: msg }
						)
						menuMessages.set(sentMsg.key.id, { param: `tiktok` });
					} catch (err) {
						console.error(err);
						lenwyreply(mess.error);
					}
					break;
				case `4`:
					lenwyreply(mess.wait);
					try {
						const quote = await zenquotes();
						const sentMsg = await lenwy.sendMessage(
							sender,{
								text: `💡 ${quote.quote} — ${quote.author}\n\nNavigasi:\n*1.* Quote lainnya\n*99.* Kembali ke menu utama\n\n_Balas Pesan ini!_`,
								mentions: [sender]
							},
							{ quoted: msg }
						)
						menuMessages.set(sentMsg.key.id, { param: `quote`, });
					} catch (error) {
						console.error("Error:", error);
						lenwyreply(mess.error);
					}
					break;
				case `5`:
					if (!isAdmin) return lenwyreply(mess.admin); // COntoh Penerapan Hanya Admin
					await lenwyreply(mess.wait);
					try {
						const workbook = XLSX.readFile("broadcast.xlsx");
						const sheetName = workbook.SheetNames[0];
						const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

						// Panggil fungsi broadcast
						await broadcast(data, msg);

						lenwyreply("📢 Broadcast selesai!");
					} catch (err) {
						console.error(err);
						lenwyreply(mess.error);
					}
					break;
				case `6`:
					try {
						const sentMsg = await lenwy.sendMessage(
							sender,{
								image: menuImage,
								caption: religimenu,
								mentions: [sender]
							},{ quoted: msg }
						)
						menuMessages.set(sentMsg.key.id, { param: 'pray' });
					} catch (err) {
						console.error(err);
						lenwyreply(mess.error);
					}
					break;
				case `7`:
					try {
						const sentMsg = await lenwy.sendMessage(
							sender,{
								text: '🤔 Gambar Atau Video?\n\nNavigasi:\n*99.* Kembali ke menu utama \n\n_Balas Pesan ini!_',
								mentions: [sender]
							},
							{ quoted: msg }
						)
						menuMessages.set(sentMsg.key.id, { param: 'stiker' });
					} catch (err) {
						console.error(err);
						lenwyreply(mess.error);
					}
					break;
			  default: { lenwyreply(mess.default) }
			}
		} else if (quotedText.includes(`🕌 MENU RELIGI`)) {
			switch (body) {
				case `1`:
					const sentMsg = await lenwy.sendMessage(
						sender,{
							text: '📍 Bagikan Lokasimu?\n\nNavigasi:\n*99.* Kembali ke menu utama \n\n_Balas Pesan ini!_',
							mentions: [sender]
						},
						{ quoted: msg }
					)
					menuMessages.set(sentMsg.key.id, { param: 'pray' });
					break;
				case `2`:
					lenwyreply(mess.wait);
					try {
						const response = await getLetter();
						await sendInChunks(
						  response.data,
						  maxBatch,         // batch size
						  maxLength,       // max char
						  (row) => `*Nomor:* ${row.nomor}\n*Nama:* ${row.nama_latin} - ${row.nama}\n*Jumlah Ayat:* ${row.jumlah_ayat}\n*Tempat Turun:* ${row.tempat_turun}\n*Arti:* ${row.arti}_`,   // formatter
						  async (chunk) => {
							await lenwyreply(chunk); // fungsi kirim WA
						  },
						  2000,
						);
						const sentMsg = await lenwy.sendMessage(
							sender,{
								text: '📖 Nomor surat berapa?\n\nNavigasi:\n*99.* Kembali ke menu utama\n\n_Balas Pesan ini!_',
								mentions: [sender]
							},
							{ quoted: msg }
						)
						menuMessages.set(sentMsg.key.id, { param: `quran`, });
					} catch (error) {
						console.error("Error:", error);
						lenwyreply(mess.error);
					}
					break;
				default: { lenwyreply(mess.default) }
			}
		}
    }
				 
	if (contextInfo?.stanzaId) {
		const repliedId = contextInfo.stanzaId;
		if (global.menuMessages && global.menuMessages.has(repliedId)) {
			const menuInfo = global.menuMessages.get(repliedId);
			console.log(`Param:`, menuInfo.param);
			if (menuInfo.param === `ai`) {
				if (body === '99') {
					await lenwy.sendMessage(
						sender,{
							image: menuImage,
							caption: lenwymenu,
							mentions: [sender]
						},{ quoted: msg }
					)
				} else {
					lenwyreply(mess.wait);
					try {
						const lenai = await Ai4Chat(body);
						await lenwyreply(`*Begini Penjelasan nya wahai madesu*\n\n${lenai}`);
						await sleep(2000);
						const sentMsg = await lenwy.sendMessage(
							sender,{
								text: '🤖 Pertanyaan Lain?\n\nNavigasi:\n*99.* Kembali ke menu utama\n\n_Balas Pesan ini!_',
								mentions: [sender]
							},
							{ quoted: msg }
						)
						menuMessages.set(sentMsg.key.id, { param: `ai` });
					} catch (error) {
						console.error(`Error:`, error);
						lenwyreply(mess.error);
					}
				}
			} else if (menuInfo.param === `yt`) {
				if (body === `99`) {
					await lenwy.sendMessage(
						sender,{
							image: menuImage,
							caption: lenwymenu,
							mentions: [sender]
						},{ quoted: msg }
					)
				} else if(menuInfo.sourceUrl) {
					if (body.toLowerCase() === `ya`) {
						lenwyreply(mess.wait);
						const result = await youtube(menuInfo.sourceUrl);
						await lenwy.sendMessage(
							sender,
							{
								video: { url: result.requested_downloads[0].url },
								caption: `*🥳 Selesai*\n\n${result.title} - (${result.requested_downloads[0].format_note})`
							},
							{ quoted: msg }
						);
					}
				} else {
					lenwyreply(mess.wait);
					try {
						const response = await usetubes(body);
						let count = 0;
						for (let row of response) {
							if (count >= limit) break;
							const sentMsg = await lenwy.sendMessage(sender, {
								text: `*📥 Download ${row.title} ?*\n\n_Balas *Ya* Pesan ini!_`,
								contextInfo: {
									externalAdReply: {
										title: row.title,
										body: row.channelTitle || `YouTube`,
										mediaType: 2,
										mediaUrl: `https://www.youtube.com/watch?v=${row.id}`,
										sourceUrl: `https://www.youtube.com/watch?v=${row.id}`,
										thumbnailUrl: `https://img.youtube.com/vi/${row.id}/hqdefault.jpg`, // ✅ Thumbnail YouTube
										renderLargerThumbnail: true
									}
								}
							});
							count++;
							 // ✅ Delay antar pesan (2 detik misalnya)
							await new Promise(resolve => setTimeout(resolve, 2000));
							menuMessages.set(sentMsg.key.id, { param: `yt`, sourceUrl: `https://www.youtube.com/watch?v=${row.id}`, });
						}
					} catch (error) {
						console.error(`Error:`, error);
						lenwyreply(mess.error);
					}
					const sentMsg = await lenwy.sendMessage(
						sender,{
							text: '▶️ Cari Video Lain?\n\nNavigasi:\n*99.* Kembali ke menu utama\n\n_Balas Pesan ini!_',
							mentions: [sender]
						},
						{ quoted: msg }
					)
					menuMessages.set(sentMsg.key.id, { param: `yt` });
				}
			} else if (menuInfo.param === `tiktok`) {
				if (body === `99`) {
					await lenwy.sendMessage(
						sender,{
							image: menuImage,
							caption: lenwymenu,
							mentions: [sender]
						},{ quoted: msg }
					)
				} else {
					lenwyreply(mess.wait);
					try {
						const result = await tiktok2(body);
						await lenwy.sendMessage(
							sender,
								{
									video: { url: result.no_watermark },
									caption: `*🥳 Selesai*\n\n${result.title})`
								},
							{ quoted: msg }
						);
					} catch (error) {
						console.error(`Error TikTok:`, error);
						lenwyreply(mess.error);
					}
				}
			} else if (menuInfo.param === `quote`) {
				if (body === '99') {
					await lenwy.sendMessage(
						sender,{
							image: menuImage,
							caption: lenwymenu,
							mentions: [sender]
						},{ quoted: msg }
					)
				} else if (body.toLowerCase() === `1`) {
					lenwyreply(mess.wait);
					try {
						const quote = await zenquotes();
						const sentMsg = await lenwy.sendMessage(
							sender,{
								text: `💡 ${quote.quote} — ${quote.author}\n\nNavigasi:\n*1.* Quote lainnya\n*99.* Kembali ke menu utama\n\n_Balas Pesan ini!_`,
								mentions: [sender]
							},
							{ quoted: msg }
						)
						menuMessages.set(sentMsg.key.id, { param: `quote`});
					} catch (error) {
						console.error(`Error:`, error);
						lenwyreply(mess.error);
					}
				}
			} else if (menuInfo.param === `pray`) {
				if (body === `99`) {
					await lenwy.sendMessage(
						sender,{
							image: menuImage,
							caption: lenwymenu,
							mentions: [sender]
						},{ quoted: msg }
					)
				} else {
					let locationMessage = msg.message.locationMessage;
					if (locationMessage) {
						try {
							await lenwyreply(mess.wait);

							// Ambil latitude & longitude
							const lat = locationMessage.degreesLatitude;
							const lon = locationMessage.degreesLongitude;
							const location = await openstreet(lat, lon);

							try {
								let data = [];
								const row = await getJadwalSholat(lat, lon);
								const qiblat = await getQiblaDirection(lat, lon);

								// default WIB
								const timezone = row.Timezone || "Asia/Jakarta";

								// Ambil waktu sekarang (WIB)
								const now = dayjs().tz(timezone);

								// Ambil tanggal hari ini
								const today = now.format("prevY-MM-DD");

								const times = {
								  Imsak: dayjs.tz(`${today} ${row.Imsak}`, "prevY-MM-DD HH:mm", timezone),
								  Fajr: dayjs.tz(`${today} ${row.Fajr}`, "prevY-MM-DD HH:mm", timezone),
								  Dhuhr: dayjs.tz(`${today} ${row.Dhuhr}`, "prevY-MM-DD HH:mm", timezone),
								  Asr: dayjs.tz(`${today} ${row.Asr}`, "prevY-MM-DD HH:mm", timezone),
								  Maghrib: dayjs.tz(`${today} ${row.Maghrib}`, "prevY-MM-DD HH:mm", timezone),
								  Isha: dayjs.tz(`${today} ${row.Isha}`, "prevY-MM-DD HH:mm", timezone),
								};

								const prayerOrder = ["Imsak", "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

								// Deteksi waktu sholat aktif
								let currentPrayer = null;
								for (let i = 0; i < prayerOrder.length; i++) {
									const thisKey = prayerOrder[i];
									const nextKey = prayerOrder[i + 1] || prayerOrder[0]; // kalau sudah terakhir (Isha), lanjut ke Imsak
									const thisTime = times[thisKey];
									let nextTime = times[nextKey];

									// khusus kalau Isya ? Imsak, nextTime pakai hari berikutnya
									if (thisKey === "Isha" && nextKey === "Imsak") {
										nextTime = nextTime.add(1, "day");
									}

									if (now.isBetween(thisTime, nextTime)) {
										currentPrayer = thisKey;
										break;
									}

									// Debug
									// console.log('coba', now.isBetween(thisTime, nextTime), thisTime.format("prevY-MM-DD HH:mm"), nextTime.format("prevY-MM-DD HH:mm"));
								}

								// fallback kalau tidak ketemu (misal sebelum imsak)
								if (!currentPrayer) currentPrayer = "Imsak";
								// console.log("Sekarang:", now.format("prevY-MM-DD HH:mm"));
								// console.log("Current prayer:", currentPrayer);

								// Format jadwal dengan highlight
								const formatLine = (key, label, time) =>
									`${key === currentPrayer ? "🟢" : "⚪"} *${label}:* ${time}`;

data.push(`📍 *Lokasi:* *${location.city}*\n*Negara:* *${location.country}*
*Koordinat:* ${lat}, ${lon}
*Map:* https://maps.google.com/?q=${lat},${lon}

🕌 Jadwal Sholat:
${formatLine("Imsak", "Imsak", row.Imsak)}
${formatLine("Fajr", "Subuh", row.Fajr)}
${formatLine("Dhuhr", "Dzuhur", row.Dhuhr)}
${formatLine("Asr", "Ashar", row.Asr)}
${formatLine("Maghrib", "Maghrib", row.Maghrib)}
${formatLine("Isha", "Isya", row.Isha)}

_Live Kiblat:_ https://qiblafinder.withgoogle.com/intl/ms/finder/ar
`);

								const result = data.join("\n\n"); // kasih jarak antar item
								await lenwyreply(result);
							} catch (error) {
								console.error("Error Aladhan:", error);
								lenwyreply(mess.error);
							}
						} catch (error) {
							console.error("Error Open Street Map:", error);
							lenwyreply(mess.error);
						}
					} else {
						const sentMsg = await lenwy.sendMessage(
							sender,{
								text: '⚠ *Tag Lokasimu*\n\nNavigasi:\n*99.* Kembali ke menu utama \n\n_Balas Pesan ini untuk kirim ulang!_',
								mentions: [sender]
							},
							{ quoted: msg }
						)
						menuMessages.set(sentMsg.key.id, { param: 'pray' });
						return;
					}
				}
			} else if (menuInfo.param === `stiker`) {
				if (body === `99`) {
					await lenwy.sendMessage(
						sender,{
							image: menuImage,
							caption: lenwymenu,
							mentions: [sender]
						},{ quoted: msg }
					)
				} else {
					try {
						if (
						  !msg.message?.imageMessage &&
						  !msg.message?.videoMessage &&
						  !(msg.message?.documentMessage?.mimetype === "image/gif")
						) {
						  const sentMsg = await lenwy.sendMessage(
								sender,{
									text: '⚠ Hanya boleh *Gambar / Video / Gif*\n\nNavigasi:\n*99.* Kembali ke menu utama \n\n_Balas Pesan ini untuk kirim ulang!_',
									mentions: [sender]
								},
								{ quoted: msg }
							)
							menuMessages.set(sentMsg.key.id, { param: 'stiker' });
							return;
						}

						ffmpeg.setFfmpegPath(ffmpegPath);
					
						// Pastikan folder tmp ada
						if (!fs.existsSync("./tmp")) fs.mkdirSync("./tmp");
						
						lenwyreply(mess.wait);
						if (msg.message?.imageMessage){
							// Konversi image ke WebP
							let media = msg.message.imageMessage;
							mediaBuffer = await downloadMedia(media, "image");
							mediaBuffer = await sharp(mediaBuffer)
								.resize(512, 512, { fit: "contain" })
								.webp({ quality: 100 })
								.toBuffer();
						} else if(msg.message?.videoMessage || msg.message?.documentMessage) {
							const isGIF = msg.message.documentMessage?.mimetype === "image/gif";
							const tempInput = `./tmp/input_${Date.now()}.${isGIF ? "gif" : "mp4"}`;
							const tempOutput = `./tmp/output_${Date.now()}.webp`;
							
							// Simpan buffer ke file sementara
							mediaBuffer = await downloadMedia(
								msg.message.videoMessage || msg.message.documentMessage,
								isGIF ? "document" : "video"
							);
							fs.writeFileSync(tempInput, mediaBuffer);
							
							// Konversi ke WebP pakai ffmpeg
							await new Promise((resolve, reject) => {
								ffmpeg(tempInput)
									.inputFormat(isGIF ? "gif" : "mp4")
									.duration(5) // maksimal 5 detik
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
					} catch (err) {
						console.error(err);
						lenwyreply(mess.error);
					}
					
				}
			} else if (menuInfo.param === `quran`) {
				if (body === '400') {
					await lenwy.sendMessage(
						sender,{
							image: menuImage,
							caption: lenwymenu,
							mentions: [sender]
						},{ quoted: msg }
					)
				} else if (body === '300') {
					lenwyreply(mess.wait);
					
				} else if (body === '200') {
					try {
						const response = await getLetter(Number(next));
						await lenwyreply(`*Nomer:* ${response.data.nomor}\n*Nama:* ${response.data.nama_latin} - ${response.data.nama}\n*Jumlah Ayat:* ${response.data.jumlah_ayat}\n*Tempat Turun:* ${response.data.tempat_turun}\n*Arti:* ${response.data.arti}\n*Deskripsi:* ${(response.data.deskripsi).replace(/<[^>]*>/g, "")}`);
						await sleep(2000);
						
						await sendInChunks(
						  response.data.ayat,
						  maxBatch,         // batch size
						  maxLength,       // max char
						  (row) => `*${row.ar}\n${row.tr}\n_${row.idn}_`,   // formatter
						  async (chunk) => {
							await lenwyreply(chunk); // fungsi kirim WA
							if (response.data?.surat_selanjutnya) {
								  next = response.data?.surat_selanjutnya.nomor;
							}
							if (response.data?.surat_sebelumnya) {
							  prev = response.data?.surat_sebelumnya.nomor;
							}
						  },
						  3000,
						);
						await sleep(2000);
						const sentMsg = await lenwy.sendMessage(
							sender,{
								text: '📖 Nomor surat lain?\n\nNavigasi:\n*200.* Selanjutnya\n*300.* Sebelumnya\n*400.* Kembali ke menu utama\n\n_Balas Pesan ini!_',
								mentions: [sender]
							},
							{ quoted: msg }
						)
						menuMessages.set(sentMsg.key.id, { param: `quran`, });
					} catch (error) {
						console.error(`Error:`, error);
						lenwyreply(mess.error);
					}
				} else {
					lenwyreply(mess.wait);
					try {
						if(!isNaN(body)){
							const response = await getLetter(Number(body));
							await lenwyreply(`*Nomer:* ${response.data.nomor}\n*Nama:* ${response.data.nama_latin} - ${response.data.nama}\n*Jumlah Ayat:* ${response.data.jumlah_ayat}\n*Tempat Turun:* ${response.data.tempat_turun}\n*Arti:* ${response.data.arti}\n*Deskripsi:* ${(response.data.deskripsi).replace(/<[^>]*>/g, "")}`);
							await sleep(2000);
							
							await sendInChunks(
							  response.data.ayat,
							  maxBatch,         // batch size
							  maxLength,       // max char
							  (row) => `*${row.ar}\n${row.tr}\n_${row.idn}_`,   // formatter
							  async (chunk) => {
								await lenwyreply(chunk); // fungsi kirim WA
								if (response.data?.surat_selanjutnya) {
								  next = response.data?.surat_selanjutnya.nomor;
								}
								if (response.data?.surat_sebelumnya) {
								  prev = response.data?.surat_sebelumnya.nomor;
								}
							  },
							  3000,
							);
							await sleep(2000);
							const sentMsg = await lenwy.sendMessage(
								sender,{
									text: '📖 Nomor surat lain?\n\nNavigasi:\n*200.* Selanjutnya\n*300.* Sebelumnya\n*99.* Kembali ke menu utama\n\n_Balas Pesan ini!_',
									mentions: [sender]
								},
								{ quoted: msg }
							)
							menuMessages.set(sentMsg.key.id, { param: `quran`, });
						} else {
							const sentMsg = await lenwy.sendMessage(
								sender,{
									text: '⚠ *Nomor*\n\nNavigasi:\n*400.* Kembali ke menu utama \n\n_Balas Pesan ini untuk kirim ulang!_',
									mentions: [sender]
								},
								{ quoted: msg }
							)
							menuMessages.set(sentMsg.key.id, { param: `quran` });
							return;
						}
					} catch (error) {
						console.error(`Error:`, error);
						lenwyreply(mess.error);
					}
				}
			}
		}
	}
}