import sql from "mssql/msnodesqlv8.js";  // <-- tambahkan .js

const config = {
  server: "192.168.6.28",
  database: "master",
  user: "sa",
  password: "PASSWORDSETUPSRVNUSANTARAMUJUR",
  options: {
    trustedConnection: true,
    encrypt: false,
    enableArithAbort: false
  }
};

async function testConnection() {
  try {
    const pool = await sql.connect(config);
    console.log("[INFO] Connected to SQL Server 2000");

    const result = await pool.request().query("SELECT @@VERSION as version");
    console.log("SQL Server Version:", result.recordset[0].version);

    pool.close();
  } catch (err) {
    console.error("[ERROR] SQL Server connection failed:", err);
  }
}

testConnection();
