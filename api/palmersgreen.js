export default async function handler(req, res) {
  try {
    const basePage = "https://www.churchservices.tv/palmersgreen";

    // Step 1: get page
    const page = await fetch(basePage, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const html = await page.text();

    const match = html.match(/https:\/\/[^\s"]+\.m3u8[^\s"]*/);

    if (!match) {
      return res.status(404).send("Stream not found");
    }

    const streamUrl = match[0];

    // Step 2: fetch playlist
    const playlistRes = await fetch(streamUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.churchservices.tv/",
      },
    });

    let playlist = await playlistRes.text();

    const base = streamUrl.substring(0, streamUrl.lastIndexOf("/") + 1);

    // Step 3: rewrite URLs
    playlist = playlist.replace(/(https?:\/\/[^\s]+)/g, (url) => {
      return `/api/proxy?url=${encodeURIComponent(url)}`;
    });

    playlist = playlist.replace(/^(?!#)(.+)$/gm, (line) => {
      if (line.startsWith("http")) return line;
      return `/api/proxy?url=${encodeURIComponent(base + line)}`;
    });

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.send(playlist);

  } catch (err) {
    res.status(500).send(err.toString());
  }
}
