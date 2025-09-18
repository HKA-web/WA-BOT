import { Pool as PgPool } from "pg";
import mysql from "mysql2/promise";
// @ts-ignore
import { sql2000Pool as sql2000BridgePool } from "../../sqlserver-pool.js";
import config from '../../config.js';

export const pgPool = new PgPool({
  host: config.database.pgsql.host ?? 'localhost',
  user: config.database.pgsql.user ?? 'postgres',
  password: config.database.pgsql.password ?? '111111',
  database: config.database.pgsql.name ?? 'postgres',
  port: config.database.pgsql.port ?? 5432,
  max: config.database.pgsql.max ?? 20,
});

export const mysqlPool = mysql.createPool({
  host: config.database.mysql.host ?? "localhost",
  user: config.database.mysql.user ?? "root",
  password: config.database.mysql.password ?? "",
  database: config.database.mysql.name ?? "testdb",
  port: config.database.mysql.port ?? 3306,
  waitForConnections: true,
  connectionLimit: config.database.mysql.max ?? 20,
});

export const sql2000Pool = {
  query: async (query: string): Promise<any[]> => {
    return await sql2000BridgePool.query(query);
  }
};
