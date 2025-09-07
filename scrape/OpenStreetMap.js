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
const axios = require("axios");

async function getLocationInfo(lat, lon) {
    try {
        const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
                params: {
                    lat,
                    lon,
                    format: "json",
                },
                headers: {
                    "User-Agent": "lenwy-bot" // wajib isi header biar diterima server
                }
            }
        );

        const data = res.data;
        return {
            city: data.address.city || data.address.town || data.address.village || "-",
            country: data.address.country || "-"
        };
    } catch (err) {
        console.error("Error getLocationInfo:", err.message);
        return { city: "-", country: "-" };
    }
}


module.exports = getLocationInfo;