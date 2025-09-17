import { dbMiddleware, bearerAuthMiddleware, authMiddleware } from "../config/app.middleware.js";
import { trimStrings, mapRowsWithSchema } from "../helper/app.helper.js";
// ===== PostgreSQL endpoint =====
export function pgQueryRoute(app) {
    app.post("/querytool/pgsql", bearerAuthMiddleware, dbMiddleware, authMiddleware, async (req, res) => {
        try {
            let { query, skip = 0, take = 100 } = req.body;
            if (!query)
                return res.status(400).json({ error: "Query is required" });
            const db = req.db;
            // Add pagination using OFFSET / LIMIT if not already present
            query = `SELECT * FROM (${query}) AS t OFFSET ${Number(skip)} LIMIT ${Number(take)}`;
            const result = await db.query(query);
            const { schema, data } = mapRowsWithSchema(result.rows);
            return res.json({
                message: "success",
                skip: Number(skip),
                take: Number(take),
                totalCount: result.rows.length,
                schema,
                data: trimStrings(data)
            });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
// ===== MySQL endpoint =====
export function mysqlQueryRoute(app) {
    app.post("/querytool/mysql", bearerAuthMiddleware, dbMiddleware, authMiddleware, async (req, res) => {
        try {
            let { query, skip = 0, take = 100 } = req.body;
            if (!query)
                return res.status(400).json({ error: "Query is required" });
            const db = req.db;
            // Add pagination using LIMIT OFFSET
            query = `SELECT * FROM (${query}) AS t LIMIT ${Number(take)} OFFSET ${Number(skip)}`;
            const [rows] = await db.query(query);
            const { schema, data } = mapRowsWithSchema(Array.isArray(rows) ? rows : []);
            return res.json({
                message: "success",
                skip: Number(skip),
                take: Number(take),
                totalCount: Array.isArray(rows) ? rows.length : 0,
                schema,
                data: trimStrings(data)
            });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
