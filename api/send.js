import fetch from "node-fetch";

const TARGET_URL = "http://18.142.155.204:8082/api/commands/send";

// ตั้งโดเมนหน้าเว็บคุณ (เพื่อ CORS) เช่น GitHub Pages
const ALLOWED_ORIGIN = "https://chanchaikanlayalong-cloud.github.io";

// อ่านรหัสผ่านจาก ENV บน Vercel (ตั้งค่าใน Dashboard)
const BASIC_AUTH_USER = process.env.TRACCAR_USER || "admin";
const BASIC_AUTH_PASS = process.env.TRACCAR_PASS || "admin123";

function cors(res, origin) {
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  // อนุญาตเฉพาะต้นทางของคุณ
  if (origin && !origin.startsWith(ALLOWED_ORIGIN)) {
    cors(res, ALLOWED_ORIGIN);
    return res.status(403).json({ error: "Origin not allowed" });
  }
  cors(res, origin || ALLOWED_ORIGIN);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const basic = Buffer.from(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASS}`).toString("base64");
    const upstream = await fetch(TARGET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${basic}`
      },
      body: JSON.stringify(req.body)
    });

    const text = await upstream.text(); // ให้ผ่านทุกอย่าง (json/text)
    res.status(upstream.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error", detail: String(err) });
  }
}