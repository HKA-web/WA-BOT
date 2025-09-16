import { Application, Request, Response } from "express";
import { createToken, tokenStore } from "../helper/app.helper.js";

// Middleware / route refresh token
export function refreshTokenRoute(app: Application) {
  app.post("/auth/refresh", async (req: Request, res: Response) => {
    try {
      const { userId, refreshToken } = req.body;
      const tokenData = tokenStore[userId];

      if (!tokenData || tokenData.refreshToken !== refreshToken) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }

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
