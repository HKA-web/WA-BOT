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
const youtubedl = require('youtube-dl-exec')

async function yt(url) {
    try {
        return output = await youtubedl(url, {
			dumpSingleJson: true,
			noCheckCertificates: true,
			noWarnings: true,
			preferFreeFormats: true,
			addHeader: ['referer:youtube.com', 'user-agent:googlebot']
		});
    } catch (err) {
        console.error("Gagal download YouTube:", err.message);
        throw err;
    }
}

module.exports = yt;