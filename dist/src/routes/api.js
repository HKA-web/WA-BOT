import { Router } from "express";
const router = Router();
/**
 * @openapi
 * /ping:
 *   get:
 *     summary: Cek status server
 *     responses:
 *       200:
 *         description: Pong response
 */
router.get("/ping", (req, res) => {
    res.json({ message: "pong!" });
});
export default router;
