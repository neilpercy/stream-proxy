export default async function handler(req, res) {
  try {
    const page = await fetch("https://www.churchservices.tv/palmersgreen", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await page.text();

    const match = html.match(/https:\/\/[^\s"]+\.m3u8[^\s"]*/);

    if (!match) {
      return res.status(404).send("Stream not found");
    }

    const streamUrl = match[0];

    // Fetch the actual playlist with proper headers
    const streamRes = await fetch(streamUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.churchservices.tv/",
      },
    });

    const content = await streamRes.text();

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.send(content);

  } catch (err) {
    res.status(500).send(err.toString());
  }
}
