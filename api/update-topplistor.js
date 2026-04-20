export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const authHeader = req.headers.authorization || "";
  const expectedToken = `Specimen2025Topplista`;

  if (authHeader !== expectedToken) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  try {
    const data = req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).json({
        error: "Invalid JSON"
      });
    }

    console.log("Topplistor mottagna:", data);

    return res.status(200).json({
      success: true,
      message: "Topplistor mottagna från Excel"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
