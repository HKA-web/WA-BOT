import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
// Gunakan process.cwd() agar selalu dari root project
const filePath = path.join(process.cwd(), 'env.yaml'); // env.yaml ada di root project
const fileContent = fs.readFileSync(filePath, 'utf8');
const config = YAML.parse(fileContent);
export default config;
