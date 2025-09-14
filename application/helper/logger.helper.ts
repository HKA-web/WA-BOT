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