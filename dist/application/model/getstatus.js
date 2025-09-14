import { ensureWA } from "../config/app.middleware.js";
export function ping(app) {
    /**
    * GET /status
    * Mengembalikan status server
    */
    app.get("/ping", ensureWA, async (req, res) => {
        res.json({ status: "pong", time: new Date().toISOString() });
    });
}
