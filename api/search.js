export default async function handler(req, res) {
    const keyword = req.query.q;

    const url =
        `https://www.googleapis.com/youtube/v3/search` +
        `?part=snippet&type=video&maxResults=10` +
        `&q=${encodeURIComponent(keyword)}` +
        `&key=${process.env.YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
}