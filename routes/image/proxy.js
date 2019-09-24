const request = require('request');

module.exports = (req, res) => {
    const { url } = req.query
    const headers = {};

    if (req.headers.range) {
        headers.Range = req.headers.range;
    }

    request.get({
        url,
        headers,
    }).pipe(res);
};