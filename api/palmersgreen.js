export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.churchservices.tv/palmersgreen", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const html = await response.text();

    const match = html.match(/https:\/\/[^\s"]+\.m3u8[^\s"]*/);

    if (!match) {
      return res.status(404).json({ error: "Stream not found" });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.json({
      stream: match[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
