import { Application, Request, Response } from "express";
import { createToken, tokenStore } from "../helper/app.helper.js";

// Middleware / route login
export function loginRoute(app: Application) {
  app.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "Field 'userId' wajib diisi" });
      }

      // generate token baru
      const newTokenData = createToken(userId);

      return res.json({
        accessToken: newTokenData.accessToken,
        refreshToken: newTokenData.refreshToken,
        expiresAt: newTokenData.expiresAt,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });
}
