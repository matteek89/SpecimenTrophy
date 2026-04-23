import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization || "";
  const expectedToken = `Bearer Specimen2025Topplista`;

  if (authHeader !== expectedToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const data = req.body;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid JSON" });
    }

    const json = JSON.stringify(data, null, 2);

    const blob = await put("tvamanna/topplistor/latest.json", json, {
      access: "public",
      allowOverwrite: true,
      contentType: "application/json; charset=utf-8"
    });

    return res.status(200).json({
      success: true,
      message: "Två-manna topplistor sparade i Blob",
      url: blob.url
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
