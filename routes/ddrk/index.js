const cheerio = require('cheerio');
const rp = require('request-promise');

module.exports = async (req, res) => {
    let { page = 1 } = req.params;
    page = +page;
    const hasPrev = page === 1 ? false : true;

    const html = await rp.get({
        uri: `https://ddrk.me/page/${page}/`,
        headers: {
            'user-agent': req.headers['user-agent'],
        },
    });
    const $ = cheerio.load(html);
    const postList = $('.post-box-list > article').map(function() {
        const $elem = $(this);
        const $cover = $elem.find('.post-box-image');
        let cover = $cover.attr('style').match(/background-image: url\((.+)\);/)[1];
        if (cover.startsWith('https://img.ddrk.me')) {
            cover = '/image/proxy?url=' + encodeURIComponent(cover.replace('https:', 'http:'));
        }

        const metas = $elem.find('.post-box-meta > a').map(function() {
            const $elem = $(this);
            const name = $elem.text().trim();
            const url = $elem.attr('href');

            return {
                name,
                url,
            };
        }).get()
        .map(function(item) {
            return `<a href="${item.url}" rel="category tag">${item.name}</a>`;
        }).join('、');

        const name = $elem.find('.post-box-title > a').text().trim();
        const origUrl = $elem.find('.post-box-title > a').attr('href');
        const url = `/ddrk/video?url=${encodeURIComponent(origUrl)}&view=2`;
        const desc = $elem.find('.post-box-title').next().text().trim();

        return {
            cover,
            metas,
            name,
            url,
            desc,
        };
    }).get();

    const totalPages = +$('.page-numbers').eq(1).text().trim();
    const hasNext = page === totalPages ? false : true;

    res.render('ddrk/index', {
        postList,
        page,
        hasPrev,
        hasNext,
    });
};