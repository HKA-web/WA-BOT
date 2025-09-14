import { ping } from "./getstatus.js";
import { sendMessage } from "./sendmessage.js";
export function setupApiDocs(app) {
    ping(app);
    sendMessage(app);
    /*
    sendAudioMessage(app);
    sendImageMessage(app);
    */
}
