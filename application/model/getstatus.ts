import { Express, Request, Response } from "express";
import { ensureWA } from "../config/app.middleware.js";

export function ping(app: Express) {
     /**
	 * GET /status
	 * Mengembalikan status server
	 */
	app.get("/ping", ensureWA, async (req: Request, res: Response) => {
		res.json({ status: "pong", time: new Date().toISOString() });
	});
}
