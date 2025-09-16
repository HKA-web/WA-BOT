import { Pool as PgPool } from "pg";
import mysql from "mysql2/promise";

// PostgreSQL Pool
const pgPool = new PgPool({
  host: process.env.PG_HOST || "192.168.3.12",
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASS || "89$CrM@*nBi_",
  database: process.env.PG_DB || "HRMS.DEV",
  port: Number(process.env.PG_PORT) || 5432,
  max: 20, // jumlah maksimal koneksi
});

// MySQL Pool
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASS || "password",
  database: process.env.MYSQL_DB || "testdb",
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 20,
});

export { pgPool, mysqlPool };
