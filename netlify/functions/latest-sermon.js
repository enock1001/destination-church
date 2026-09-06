// Fetches the newest upload from the Destination Church YouTube channel
// (Prophet David Kojo Kyei) via YouTube's public RSS feed. Runs server-side
// so there's no CORS restriction and no API key needed.

const CHANNEL_ID = 'UCGY4-RyMZrARjCnvhqkR8eQ';

exports.handler = async function () {
  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const res = await fetch(feedUrl);

    if (!res.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Could not reach YouTube' }) };
    }

    const xml = await res.text();
    const entryMatch = xml.match(/<entry>[\s\S]*?<\/entry>/);

    if (!entryMatch) {
      return { statusCode: 404, body: JSON.stringify({ error: 'No videos found' }) };
    }

    const entry = entryMatch[0];
    const videoId = (entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/) || [])[1];
    const rawTitle = (entry.match(/<title>(.*?)<\/title>/) || [])[1] || '';
    const published = (entry.match(/<published>(.*?)<\/published>/) || [])[1];

    // Decode basic XML entities in the title
    const title = rawTitle
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800' // 30 min cache
      },
      body: JSON.stringify({ videoId, title, published })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
