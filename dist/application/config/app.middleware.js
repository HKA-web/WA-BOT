import { WhatsAppController } from "../controller/whatsapp.controller.js";
import { tokenStore } from "../helper/app.helper.js";
import { pgPool, mysqlPool, sql2000Pool } from "./app.database.js"; // tambahkan sql2000Pool
import { getApiToken } from "./app.config.js"; // import getter
// Buat 1 instance global yang sama
export const waController = new WhatsAppController();
// Middleware memastikan WA siap
export async function ensureWA(req, res, next) {
    const sock = waController.getSocket();
    if (!sock)
        return res.status(500).json({ error: "Socket WA belum siap" });
    next();
}
// Middleware cek nomor WA
export async function ensureRegisteredWA(req, res, next) {
    try {
        const sock = waController.getSocket();
        if (!sock)
            return res.status(500).json({ error: "Socket WA belum siap" });
        let jids = [];
        if (Array.isArray(req.body))
            jids = req.body.map((item) => item.jid).filter(Boolean);
        else if (req.body.jid)
            jids = [req.body.jid];
        else if (req.query.jid)
            jids = [req.query.jid.toString()];
        if (jids.length === 0)
            return res.status(400).json({ error: "Nomor (jid) wajib disediakan" });
        const flat = [];
        for (const jid of jids) {
            if (jid.endsWith("@s.whatsapp.net")) {
                const results = await sock.onWhatsApp(jid) || [];
                flat.push({ jid, exists: results[0]?.exists ?? false, type: "user" });
            }
            else if (jid.endsWith("@g.us")) {
                try {
                    await sock.groupMetadata(jid);
                    flat.push({ jid, exists: true, type: "group" });
                }
                catch {
                    flat.push({ jid, exists: false, type: "group" });
                }
            }
            else if (jid.endsWith("@c.us")) {
                flat.push({ jid, exists: true, type: "business" });
            }
            else {
                flat.push({ jid, exists: false, type: "unknown" });
            }
        }
        req.waUsers = flat;
        next();
    }
    catch (err) {
        console.error("Error cek nomor:", err);
        res.status(500).json({ error: "Gagal cek nomor WA" });
    }
}
// ================================
// Middleware pilih database
// ================================
export function dbMiddleware(req, _res, next) {
    if (req.path.startsWith("/querytool/mysql")) {
        req.db = mysqlPool;
        req.dbType = "mysql";
    }
    else if (req.path.startsWith("/querytool/sqlserver")) {
        req.db = sql2000Pool;
        req.dbType = "sqlserver";
    }
    else {
        req.db = pgPool;
        req.dbType = "pgsql";
    }
    next();
}
// ================================
// Bearer auth middleware
// ================================
export function bearerAuthMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const userId = req.headers["x-user-id"];
    if (!authHeader || !userId)
        return res.status(401).json({ error: "Missing Authorization or X-User-Id" });
    const token = authHeader.split(" ")[1];
    const validToken = getApiToken(userId);
    if (!validToken || token !== validToken)
        return res.status(401).json({ error: "Invalid token" });
    next();
}
// ================================
// Access token middleware
// ================================
export function authMiddleware(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    const userId = req.headers["x-user-id"];
    if (!bearerHeader || !userId)
        return res.status(401).json({ error: "Missing Authorization or X-User-Id" });
    const token = bearerHeader.split(" ")[1];
    const tokenData = tokenStore[userId];
    if (!tokenData)
        return res.status(401).json({ error: "Invalid user or token" });
    if (tokenData.accessToken === token) {
        if (tokenData.expiresAt && tokenData.expiresAt > Date.now()) {
            return next();
        }
        else {
            return res.status(401).json({ error: "Access token expired", code: "TOKEN_EXPIRED" });
        }
    }
    else {
        return res.status(401).json({ error: "Invalid access token" });
    }
}
