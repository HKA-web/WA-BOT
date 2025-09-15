import { Express } from "express";
import { ping } from "./getstatus.js";
import { sendMessage } from "./sendmessage.js";
import { sendImage } from "./sendimage.js";
import { sendAudio } from "./sendaudio.js";


export function setupApiDocs(app: Express) {
  ping(app);
  sendMessage(app);
  sendImage(app);
  sendAudio(app);
}