import { ping } from "./getstatus.js";
import { sendMessage } from "./sendmessage.js";
import { sendImage } from "./sendimage.js";
import { sendAudio } from "./sendaudio.js";
export function setupApiDocs(app) {
    ping(app);
    sendMessage(app);
    sendImage(app);
    sendAudio(app);
}
