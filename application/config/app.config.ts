import { tokenStore } from "../helper/app.helper.js";
import dotenv from 'dotenv';
dotenv.config(); // Load variabel dari .env

export const AppConfig = {
  port: process.env.PORT || 3000,
  swaggerPath: process.env.SWAGGER_PATH || "/api-docs",

  // Custom messages
  mess: {
    wait: process.env.MSG_WAIT || 'Please wait...',
    error: process.env.MSG_ERROR || 'Failed to process your request',
    default: process.env.MSG_DEFAULT || 'Command not recognized',
    admin: process.env.MSG_ADMIN || 'This command can only be used by admins',
    group: process.env.MSG_GROUP || 'This command can only be used in groups',
  },

  // Admin WA
  admin: (process.env.ADMIN_JIDS || '6285648007953@s.whatsapp.net').split(','),
};

export function getApiToken(userId?: string) {
  if (!userId) return ""; // default kosong jika tidak ada userId
  return tokenStore[userId]?.accessToken || "";
}