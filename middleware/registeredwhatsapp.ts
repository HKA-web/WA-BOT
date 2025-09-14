import { getSocket } from "../src/whatsapp.js";

export async function isRegistered(number: string) {
  const sock = getSocket();
  if (!sock) throw new Error("Socket WA belum siap");

  const result = await sock.onWhatsApp(`${number}@s.whatsapp.net`);
  if (!result || result.length === 0) return false;
  return result[0]?.exists || false;
}
