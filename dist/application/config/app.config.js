import { tokenStore } from "../helper/app.helper.js";
import config from '../../config.js';
export const AppConfig = {
    port: config.server.port ?? 3000,
    swaggerPath: config.server.swagger_path ?? "/api-docs",
    // Custom messages
    mess: {
        wait: config.server.msg_wait ?? 'Please wait...',
        error: config.server.msg_error ?? 'Failed to process your request',
        default: config.server.msg_default ?? 'Command not recognized',
        admin: config.server.msg_admin ?? 'This command can only be used by admins',
        group: config.server.msg_group ?? 'This command can only be used in groups',
    },
    // Admin WA
    admin: (config.server.admin_jids ?? '6282647117181@s.whatsapp.net').split(','),
};
export function getApiToken(userId) {
    if (!userId)
        return ""; // default kosong jika tidak ada userId
    return tokenStore[userId]?.accessToken || "";
}
