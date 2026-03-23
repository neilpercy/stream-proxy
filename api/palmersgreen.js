export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.churchservices.tv/palmersgreen", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await response.text();

    const match = html.match(/https:\/\/[^\s"]+\.m3u8[^\s"]*/);

    if (!match) {
      return res.status(404).send("Stream not found");
    }

    const streamUrl = match[0];

    return res.redirect(streamUrl);
  } catch (err) {
    return res.status(500).send("Error: " + err.message);
  }
// trigger deploy
}
