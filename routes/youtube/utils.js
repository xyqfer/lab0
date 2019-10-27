const ytdl = require('../../utils/node-ytdl-core');
const YOUTUBE_MAP = {};

const getUrl = async (id) => {
    let url = '';

    if (YOUTUBE_MAP[id] && (YOUTUBE_MAP[id].expire - Date.now() > 0)) {
        url = YOUTUBE_MAP[id].url;
    } else {
        const { formats } = await ytdl.getBasicInfo(id);
        
        try {
            url = formats.find((item) => {
                return item.type.includes('vp9') && item.quality_label === '720p';
            }).url;
        } catch(err) {
            // url = formats[0].url;
        }
        const expire = (new URL(url)).searchParams.get('expire') * 1000;

        YOUTUBE_MAP[id] = {
            url,
            expire,
        };
    }

    return url;
};

module.exports = {
    getUrl,
};