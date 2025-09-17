import crypto from "crypto";
import readline from "readline";
import chalk from "chalk";
import dotenv from 'dotenv';
dotenv.config(); // Load variabel dari .env
export const tokenStore = {};
function generateToken() {
    return crypto.randomBytes(32).toString("hex");
}
export const Logger = {
    info: (msg) => console.log(chalk.yellow.bold(`[INFO] ${msg}`)),
    error: (msg) => console.log(chalk.red.bold(`[ERROR] ${msg}`))
};
export function sleep(ms = Number(process.env.DELAY) || 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function question(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(query, answer => {
            rl.close();
            resolve(answer);
        });
    });
}
export async function sendChunk(text, sendFunc, maxCharsPerBatch = Math.min(Number(process.env.MAX_CHAR) || 4000, 4000), delayMs = Number(process.env.DELAY) || 500, mode = process.env.SEND_CHUNK_MODE || "auto") {
    let chunks = [];
    // === Pilih mode otomatis ===
    if (mode === "auto") {
        if (text.includes("\n")) {
            mode = "char"; // kalau ada newline, pakai char biar format terjaga
        }
        else {
            mode = "word"; // kalau tidak ada newline, lebih efisien pakai word
        }
    }
    if (mode === "word") {
        const words = text.split(/\s+/);
        let buffer = "";
        for (const word of words) {
            if ((buffer + " " + word).trim().length > maxCharsPerBatch) {
                chunks.push(buffer.trim());
                buffer = word;
            }
            else {
                buffer += " " + word;
            }
        }
        if (buffer.trim().length > 0)
            chunks.push(buffer.trim());
    }
    else {
        for (let i = 0; i < text.length; i += maxCharsPerBatch) {
            chunks.push(text.slice(i, i + maxCharsPerBatch));
        }
    }
    for (const chunk of chunks) {
        await sendFunc(chunk);
        if (delayMs > 0) {
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
}
// recursive trim function
export function trimStrings(obj) {
    if (Array.isArray(obj)) {
        return obj.map(trimStrings);
    }
    else if (obj && typeof obj === "object") {
        const newObj = {};
        for (const key in obj) {
            if (typeof obj[key] === "string") {
                newObj[key] = obj[key].trim();
            }
            else if (Array.isArray(obj[key]) || typeof obj[key] === "object") {
                newObj[key] = trimStrings(obj[key]);
            }
            else {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    }
    return obj;
}
export function generateSchemaFromRow(row) {
    const schema = [];
    for (const key in row) {
        const value = row[key];
        let type = "any";
        if (value === null || value === undefined) {
            type = "any";
        }
        else if (typeof value === "string") {
            type = "string";
        }
        else if (typeof value === "number") {
            type = "number";
        }
        else if (value instanceof Date) {
            type = "date";
        }
        else if (typeof value === "boolean") {
            type = "boolean";
        }
        schema.push({ name: key, type });
    }
    return schema;
}
export function mapRowsWithSchema(rows) {
    if (!rows || rows.length === 0)
        return { schema: [], data: [] };
    const schema = generateSchemaFromRow(rows[0]);
    const data = rows.map(row => {
        const obj = {};
        for (const col of schema) {
            let value = row[col.name];
            if (col.type === "string" && typeof value === "string")
                value = value.trim();
            if (col.type === "date" && value)
                value = new Date(value);
            obj[col.name] = value;
        }
        return obj;
    });
    return { schema, data };
}
export function mapRowsDynamic(rows) {
    if (!rows || rows.length === 0)
        return [];
    const schema = generateSchemaFromRow(rows[0]);
    return rows.map(row => {
        const obj = {};
        for (const col of schema) {
            let value = row[col.name];
            if (col.type === "string" && typeof value === "string")
                value = value.trim();
            if (col.type === "date" && value)
                value = new Date(value);
            obj[col.name] = value;
        }
        return obj;
    });
}
// === Generate Access + Refresh Token ===
export function createToken(userId, type = "login") {
    const refreshToken = generateToken();
    if (type === "login") {
        // login hanya buat refreshToken
        tokenStore[userId] = { refreshToken };
        return tokenStore[userId];
    }
    else {
        // refresh → buat accessToken + update refreshToken lama
        const expiresMinutes = Number(process.env.TOKEN_EXPIRED) || 5;
        const accessToken = generateToken();
        const expiresAt = Date.now() + expiresMinutes * 60 * 1000;
        tokenStore[userId] = { ...tokenStore[userId], accessToken, refreshToken, expiresAt };
        return tokenStore[userId];
    }
}
