import { Request, Response, NextFunction } from "express";
import { WhatsAppController } from "../controller/whatsapp.controller.js";
import { tokenStore } from "../helper/app.helper.js";
import type { Pool as PgPool } from "pg";
import type { Pool as MySqlPool } from "mysql2/promise";
import { pgPool, mysqlPool, sql2000Pool } from "./app.database.js"; // tambahkan sql2000Pool
import { getApiToken } from "./app.config.js"; // import getter

// extend Request supaya ada `db` & `dbType`
export interface DBRequest extends Request {
  db?: PgPool | MySqlPool | any; // SQL Server pakai `any`
  dbType?: "pgsql" | "mysql" | "sqlserver";
}

// Buat 1 instance global yang sama
export const waController = new WhatsAppController();

// Middleware memastikan WA siap
export async function ensureWA(req: Request, res: Response, next: NextFunction) {
  const sock = waController.getSocket();
  if (!sock) return res.status(500).json({ error: "Socket WA belum siap" });
  next();
}

// Middleware cek nomor WA
export async function ensureRegisteredWA(req: Request, res: Response, next: NextFunction) {
  try {
    const sock = waController.getSocket();
    if (!sock) return res.status(500).json({ error: "Socket WA belum siap" });

    let jids: string[] = [];
    if (Array.isArray(req.body)) jids = req.body.map((item: any) => item.jid).filter(Boolean);
    else if (req.body.jid) jids = [req.body.jid];
    else if (req.query.jid) jids = [req.query.jid.toString()];

    if (jids.length === 0) return res.status(400).json({ error: "Nomor (jid) wajib disediakan" });

    const flat: { jid: string; exists: boolean; type: string }[] = [];
    for (const jid of jids) {
      if (jid.endsWith("@s.whatsapp.net")) {
        const results = await sock.onWhatsApp(jid) || [];
        flat.push({ jid, exists: results[0]?.exists ?? false, type: "user" });
      } else if (jid.endsWith("@g.us")) {
        try { await sock.groupMetadata(jid); flat.push({ jid, exists: true, type: "group" }); }
        catch { flat.push({ jid, exists: false, type: "group" }); }
      } else if (jid.endsWith("@c.us")) {
        flat.push({ jid, exists: true, type: "business" });
      } else {
        flat.push({ jid, exists: false, type: "unknown" });
      }
    }

    (req as any).waUsers = flat;
    next();
  } catch (err) {
    console.error("Error cek nomor:", err);
    res.status(500).json({ error: "Gagal cek nomor WA" });
  }
}

// ================================
// Middleware pilih database
// ================================
export function dbMiddleware(req: DBRequest, _res: Response, next: NextFunction) {
  if (req.path.startsWith("/querytool/mysql")) {
    req.db = mysqlPool;
    req.dbType = "mysql";
  } else if (req.path.startsWith("/querytool/sqlserver")) {
    req.db = sql2000Pool;
    req.dbType = "sqlserver";
  } else {
    req.db = pgPool;
    req.dbType = "pgsql";
  }
  next();
}

// ================================
// Bearer auth middleware
// ================================
export function bearerAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const userId = req.headers["x-user-id"] as string;

  if (!authHeader || !userId) return res.status(401).json({ error: "Missing Authorization or X-User-Id" });

  const token = authHeader.split(" ")[1];
  const validToken = getApiToken(userId);

  if (!validToken || token !== validToken) return res.status(401).json({ error: "Invalid token" });

  next();
}

// ================================
// Access token middleware
// ================================
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const bearerHeader = req.headers["authorization"];
  const userId = req.headers["x-user-id"] as string;

  if (!bearerHeader || !userId) return res.status(401).json({ error: "Missing Authorization or X-User-Id" });

  const token = bearerHeader.split(" ")[1];
  const tokenData = tokenStore[userId];

  if (!tokenData) return res.status(401).json({ error: "Invalid user or token" });

  if (tokenData.accessToken === token) {
    if (tokenData.expiresAt && tokenData.expiresAt > Date.now()) {
      return next();
    } else {
      return res.status(401).json({ error: "Access token expired", code: "TOKEN_EXPIRED" });
    }
  } else {
    return res.status(401).json({ error: "Invalid access token" });
  }
}
