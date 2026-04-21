import { head } from '@vercel/blob';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://matteek89.github.io",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  if (req.method !== "GET") {
    res.setHeader("Access-Control-Allow-Origin", CORS_HEADERS["Access-Control-Allow-Origin"]);
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const blob = await head("topplistor/latest.json");
    const response = await fetch(blob.url);
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", CORS_HEADERS["Access-Control-Allow-Origin"]);
    res.setHeader("Access-Control-Allow-Methods", CORS_HEADERS["Access-Control-Allow-Methods"]);
    res.setHeader("Access-Control-Allow-Headers", CORS_HEADERS["Access-Control-Allow-Headers"]);

    return res.status(200).json(data);
  } catch (error) {
    res.setHeader("Access-Control-Allow-Origin", CORS_HEADERS["Access-Control-Allow-Origin"]);
    return res.status(404).json({
      error: "Ingen topplistedata uppladdad ännu"
    });
  }
}
