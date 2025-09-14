import { ping } from "./getstatus.js";
export function setupApiDocs(routeServer) {
    ping(routeServer);
    /*
    sendAudioMessage(routeServer);
    sendImageMessage(routeServer);
    sendMessage(routeServer);
    */
}
