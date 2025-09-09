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
const baseurl = 'https://equran.id/api/';

	async function getLetter(param = null) {
	  try {
		let res;
		if (param) {
		  res = await axios.get(`${baseurl}surat/${param}`);
		} else {
		  res = await axios.get(`${baseurl}surat/`);
		}
		const result = {
          data: res.data,
          url: `${baseurl}surat/${param}`,
        };
		return result;
	  } catch (err) {
		throw new Error("Gagal ambil surat: " + err.message);
	  }
	}
	
	async function getVerse(param) {
	  try {
		let res;
		if (param) {
		  res = await axios.get(`https://equran.id/api/surat/1`);
		}
		return res;
	  } catch (err) {
		throw new Error("Gagal ambil surat: " + err.message);
	  }
	}
	

module.exports = { getLetter, getVerse };