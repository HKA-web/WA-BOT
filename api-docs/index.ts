import { Express } from "express";
import { ping } from "./getstatus.js";
import { sendAudioMessage } from "./sendaudio.js";
import { sendImageMessage } from "./sendimage.js";
import { sendMessage } from "./sendmessage.js";


export function setupApiDocs(routeServer: Express) {
  ping(routeServer);
  sendAudioMessage(routeServer);
  sendImageMessage(routeServer);
  sendMessage(routeServer);
}
