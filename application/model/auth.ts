import { Application, Request, Response } from "express";
import { createToken, tokenStore } from "../helper/app.helper.js";

// Middleware / route login
export function loginRoute(app: Application) {
  app.post("/auth/login", async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "Field 'userId' wajib diisi" });

    // login hanya generate refreshToken
    const tokenData = createToken(userId, "login");

    return res.json({
      refreshToken: tokenData.refreshToken
    });
  });
}

