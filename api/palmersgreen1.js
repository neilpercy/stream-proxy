export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.churchservices.tv/palmersgreen");
    const html = await response.text();

    // Try to find m3u8 stream
    const match = html.match(/https:\/\/[^\s"]+\.m3u8[^\s"]*/);

    if (!match) {
      return res.status(404).send("Stream not found");
    }

    const streamUrl = match[0];

    // Redirect user to live stream
    res.writeHead(302, {
      Location: streamUrl,
    });

    res.end();
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
}