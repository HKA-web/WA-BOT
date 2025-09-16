// application/model/querytool.ts
import { Express, Response } from "express";
import type { Pool as PgPool } from "pg";
import type { Pool as MySqlPool } from "mysql2/promise";
import { dbMiddleware, DBRequest, bearerAuthMiddleware, authMiddleware } from "../config/app.middleware.js";
import { trimStrings, mapRowsWithSchema } from "../helper/app.helper.js";

// ===== PostgreSQL endpoint =====
export function pgQueryRoute(app: Express) {
  app.post("/querytool/pgsql", bearerAuthMiddleware, dbMiddleware, authMiddleware, async (req: DBRequest, res: Response) => {
    try {
      let { query, skip = 0, take = 100 } = req.body as { query: string; skip?: number; take?: number };
      if (!query) return res.status(400).json({ error: "Query is required" });

      const db = req.db as PgPool;

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
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}

// ===== MySQL endpoint =====
export function mysqlQueryRoute(app: Express) {
  app.post("/querytool/mysql", bearerAuthMiddleware, dbMiddleware, authMiddleware, async (req: DBRequest, res: Response) => {
    try {
      let { query, skip = 0, take = 100 } = req.body as { query: string; skip?: number; take?: number };
      if (!query) return res.status(400).json({ error: "Query is required" });

      const db = req.db as MySqlPool;

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
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
