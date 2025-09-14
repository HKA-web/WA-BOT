import express from "express";
import { setupSwagger } from "../config/swagger.js";
import axios from "axios";

const app = express();
const PORT = 4000;
app.use(express.json());

// Swagger
setupSwagger(app);

// Proxy internal API


app.get("/ping", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/ping");
    res.json(response.data);
  } catch (err: any) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: "Gagal ambil status bot" });
  }
});

app.post("/send-audio", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:3000/send-audio", req.body);
    res.json(response.data);
  } catch (err: any) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: "Gagal kirim pesan suara via bot" });
  }
});

app.post("/send-image", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:3000/send-image", req.body);
    res.json(response.data);
  } catch (err: any) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: "Gagal kirim pesan bergambar via bot" });
  }
});

app.post("/send-message", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:3000/send-message", req.body);
    res.json(response.data);
  } catch (err: any) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: "Gagal kirim pesan via bot" });
  }
});


app.listen(PORT, () => {
  console.log(`Swagger server jalan di http://localhost:4000`);
  console.log(`Dokumentasi http://localhost:4000/api-docs/`);
});
