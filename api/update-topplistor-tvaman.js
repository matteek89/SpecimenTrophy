let savedData = {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const authHeader = req.headers.authorization || "";
  const expectedToken = `Bearer Specimen2025Topplista`;

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

    savedData = data;

    console.log("Två-manna topplistor mottagna:", data);

    return res.status(200).json({
      success: true,
      message: "Två-manna topplistor sparade"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
