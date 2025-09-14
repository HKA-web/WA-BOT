import { Request, Response, NextFunction } from "express";
import { getSocket } from "../src/whatsapp.js";

export async function ensureWA(req: Request, res: Response, next: NextFunction) {
  const sock = getSocket();
  if (!sock) return res.status(500).json({ error: "Socket WA belum siap" });
  next();
}
