import pyodbc
import sys
import json
import traceback
from datetime import datetime, date
import yaml

# ===== Load YAML config =====
with open("env.yaml", "r", encoding="utf-8") as f:
    cfg = cfg = yaml.safe_load(f)["database"]["sqlserver"]

USE_TCP = cfg.get("tcp", False)
TCP_SERVER = cfg.get("host", "localhost")
TCP_PORT = cfg.get("port", 1433)
PIPE_NAME = cfg.get("pipe", "\\\\localhost\\pipe\\sql\\query")
DATABASE = cfg.get("name", "master")
USERNAME = cfg.get("user", "sa")
PASSWORD = cfg.get("password", "")

# Ambil query dari argumen Node.js
query = sys.argv[1] if len(sys.argv) > 1 else "SELECT @@VERSION as version"

# Fungsi untuk serialize tipe data non-JSON (datetime, date)
def default_serializer(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()  # "YYYY-MM-DDTHH:MM:SS"
    return str(obj)  # fallback, misal Decimal atau lainnya

try:
    if USE_TCP:
        conn_str = f"DRIVER={{SQL Server}};SERVER={TCP_SERVER},{TCP_PORT};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD}"
    else:
        conn_str = f"DRIVER={{SQL Server}};SERVER=np:{PIPE_NAME};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD}"

    conn = pyodbc.connect(conn_str, timeout=5)
    cursor = conn.cursor()
    cursor.execute(query)
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()
    
    result = [dict(zip(columns, row)) for row in rows]
    print(json.dumps({"result": result}, default=default_serializer))
    conn.close()
except Exception as e:
    traceback.print_exc()
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
