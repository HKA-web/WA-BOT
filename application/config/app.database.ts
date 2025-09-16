import { Pool as PgPool } from "pg";
import mysql from "mysql2/promise";

// PostgreSQL Pool
const pgPool = new PgPool({
  host: process.env.PG_HOST || "localhost",
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASS || "",
  database: process.env.PG_DB || "postgres",
  port: Number(process.env.PG_PORT) || 5432,
  max: Number(process.env.PG_CONNECT_MAX) || 20,
});

// MySQL Pool
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASS || "",
  database: process.env.MYSQL_DB || "testdb",
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: Number(process.env.MYSQL_CONNECT_MAX) || 20,
});

export { pgPool, mysqlPool };
