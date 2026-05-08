import { head } from '@vercel/blob';

const ALLOWED_ORIGINS = [
  "https://matteek89.github.io",
  "https://www.specimentrophy.se",
  "https://specimentrophy.se"
];

function getCorsHeaders(req) {
  const origin = req.headers.origin;
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : "https://www.specimentrophy.se";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

export default async function handler(req, res) {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    return res.end();
  }

  if (req.method !== "GET") {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const blob = await head("topplistor/latest.json");
    const response = await fetch(blob.url);
    const data = await response.json();

    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(200).json(data);
  } catch (error) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(404).json({
      error: "Ingen topplistedata uppladdad ännu"
    });
  }
}
