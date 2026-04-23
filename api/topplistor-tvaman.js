let savedData = {};

export default async function handler(req, res) {
  try {
    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
