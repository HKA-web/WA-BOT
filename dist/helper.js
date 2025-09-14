import readline from "readline";
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
