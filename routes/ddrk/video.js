const cheerio = require('cheerio');
const rp = require('request-promise');

module.exports = async (req, res) => {
    const { id } = req.params;
    const url = `https://ddrk.me/?p=${id}`;

    const html = await rp.get({
        uri: url,
        headers: {
            'user-agent': req.headers['user-agent'],
        },
    });
    const $ = cheerio.load(html);
    const title = $('title').text().trim();
    const data = $('.wp-playlist-script').html().trim();
    const lastModified = $('.post-last-modified-td').text().trim();
    const douList = $('.doulist-item').html();

    res.render('ddrk/video', {
        id,
        title,
        data,
        lastModified,
        douList,
    });
};