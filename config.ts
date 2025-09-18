import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { fileURLToPath } from 'url';

interface ServerConfig {
  port: number;
  swagger_path: string;
  msg_wait: string;
  msg_error: string;
  msg_default: string;
  msg_admin: string;
  msg_group: string;
  admin_jids: string;
}

interface WhatsappConfig {
  max_char: number;
  delay: number;
  token_expired: number;
  send_chunk_mode: string;
}

interface PsqlConfig {
  host: string;
  name: string;
  user: string;
  password: string;
  port: number;
  max: number;
}

interface MysqlConfig {
  host: string;
  name: string;
  user: string;
  password: string;
  port: number;
  max: number;
}


interface SqlServerConfig {
  host: string;
  name: string;
  user: string;
  password: string;
  port: number;
  max: number;
  maxbuffer: number;
}

interface Config {
  server: ServerConfig;
  whatsapp: WhatsappConfig;
  database: {
    pgsql: PsqlConfig;
    mysql: MysqlConfig;
    sqlserver: SqlServerConfig;
  };
}

// Gunakan process.cwd() agar selalu dari root project
const filePath = path.join(process.cwd(), 'env.yaml'); // env.yaml ada di root project
const fileContent = fs.readFileSync(filePath, 'utf8');
const config = YAML.parse(fileContent);

export default config;
