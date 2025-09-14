import { Express } from "express";
import { ping } from "./getstatus.js";


export function setupApiDocs(routeServer: Express) {
  ping(routeServer);
  /*
  sendAudioMessage(routeServer);
  sendImageMessage(routeServer);
  sendMessage(routeServer);
  */
}