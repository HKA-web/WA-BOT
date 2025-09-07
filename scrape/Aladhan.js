/*  

  Made By Lenwy
  Base : Lenwy
  WhatsApp : wa.me/6283829814737
  Telegram : t.me/ilenwy
  Youtube : @Lenwy

  Channel : https://whatsapp.com/channel/0029VaGdzBSGZNCmoTgN2K0u

  Copy Code?, Recode?, Rename?, Reupload?, Reseller? Taruh Credit Ya :D

  Deskripsi: Fungsi Untuk Mengambil Respons AI
  Mohon Untuk Tidak Menghapus Watermark Di Dalam Kode Ini

*/

const axios = require('axios');

    async function getJadwalSholat(lat, lon, date = "today") {
	  try {
		const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&method=2`;
		const res = await axios.get(url);
		return res.data.data.timings;
	  } catch (err) {
		throw new Error("Gagal ambil jadwal sholat: " + err.message);
	  }
	}
	
	async function getQiblaDirection(lat, lon) {
	  try {
		const url = `https://api.aladhan.com/v1/qibla/${lat}/${lon}`;
		const res = await axios.get(url);
		return res.data.data.direction; // derajat arah kiblat
	  } catch (err) {
		throw new Error("Gagal ambil arah kiblat: " + err.message);
	  }
	}

module.exports = { getJadwalSholat, getQiblaDirection };