export default async function handler(req, res) {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({
                error: "検索キーワードが必要です。"
            });
        }

        const apiKey = process.env.YOUTUBE_API_KEY;

        const searchUrl =
            `https://www.googleapis.com/youtube/v3/search` +
            `?part=snippet&type=video&maxResults=10` +
            `&q=${encodeURIComponent(keyword)}` +
            `&key=${apiKey}`;

        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchResponse.ok) {
            return res.status(searchResponse.status).json(searchData);
        }

        const videoIds = searchData.items
            .map(function (item) {
                return item.id.videoId;
            })
            .join(",");

        const videosUrl =
            `https://www.googleapis.com/youtube/v3/videos` +
            `?part=contentDetails` +
            `&id=${videoIds}` +
            `&key=${apiKey}`;

        const videosResponse = await fetch(videosUrl);
        const videosData = await videosResponse.json();

        if (!videosResponse.ok) {
            return res.status(videosResponse.status).json(videosData);
        }

        const durationMap = {};

        videosData.items.forEach(function (video) {
            durationMap[video.id] =
                video.contentDetails.duration;
        });

        const items = searchData.items.map(function (item) {
            return {
                ...item,
                duration:
                    durationMap[item.id.videoId] || ""
            };
        });

        res.status(200).json({
            items: items
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "YouTube動画の取得に失敗しました。"
        });
    }
}