import readline from "readline";
import chalk from "chalk";

export const Logger = {
    info: (msg: string) => console.log(chalk.yellow.bold(`[INFO] ${msg}`)),
    error: (msg: string) => console.log(chalk.red.bold(`[ERROR] ${msg}`))
};

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function question(query: string): Promise<string> {
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

export async function sendInChunks(
    text: string,
    maxCharsPerBatch: number,
    sendFunc: (batchText: string) => Promise<void>,
    delayMs = 0
) {
    const words = text.split(/\s+/); // split per kata
    let buffer = "";

    for (const word of words) {
        if ((buffer + " " + word).trim().length > maxCharsPerBatch) {
            await sendFunc(buffer.trim());
            buffer = word;
            if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));
        } else {
            buffer += " " + word;
        }
    }

    if (buffer.trim().length > 0) {
        await sendFunc(buffer.trim());
    }
}

