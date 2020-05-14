const cheerio = require('cheerio');
const rp = require('request-promise');

module.exports = async (req, res) => {
    const { url, view } = req.query;

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
    const entryDate = $('.entry-date').text().trim();
    const catLinks = $('.cat-links').html();
    const tagLinks = $('.tags-links').html();

    $('.page-links > a').each(function() {
        const $item = $(this);
        const origUrl = $item.attr('href');
        const url = `/ddrk/video?url=${encodeURIComponent(origUrl)}&view=2`;
        $item.attr('href', url);
    });
    const pageLinks = $('.page-links').html();

    res.render(`ddrk/video${view}`, {
        url,
        title,
        data,
        lastModified,
        douList,
        entryDate,
        catLinks,
        tagLinks,
        pageLinks,
    });
};