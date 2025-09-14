import readline from "readline";
import chalk from "chalk";
export const Logger = {
    info: (msg) => console.log(chalk.yellow.bold(`[INFO] ${msg}`)),
    error: (msg) => console.log(chalk.red.bold(`[ERROR] ${msg}`))
};
export function sleep(ms) {
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
