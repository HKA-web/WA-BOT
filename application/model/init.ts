import { Express } from "express";
import { ping } from "./getstatus.js";
import { sendMessage } from "./sendmessage.js";
import { sendImage } from "./sendimage.js";
import { sendAudio } from "./sendaudio.js";
import { pgQueryRoute, mysqlQueryRoute, sqlServerQueryRoute } from "./querytool.js";
import { refreshTokenRoute } from "./refresh.js";
import { loginRoute } from "./auth.js";


export function setupApiDocs(app: Express) {
  ping(app);
  sendMessage(app);
  sendImage(app);
  sendAudio(app);
  pgQueryRoute(app);
  mysqlQueryRoute(app);
  sqlServerQueryRoute(app);
  refreshTokenRoute(app);
  loginRoute(app);
}