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

async function zenquotes() {
  try {
    const response = await axios.get('https://indonesian-quotes-api.vercel.app/api/quotes/random');
    const quotes = response.data.data;
    return {
      author: quotes.quote,
      quote: quotes.source
    };
  } catch (error) {
    throw error;
  }
}

module.exports = zenquotes;