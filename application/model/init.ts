import { Express } from "express";
import { ping } from "./getstatus.js";
import { sendMessage } from "./sendmessage.js";


export function setupApiDocs(app: Express) {
  ping(app);
  sendMessage(app);
  /*
  sendAudioMessage(app);
  sendImageMessage(app);
  */
}