'use strict';

const utils = require('./utils.js');
const createRangeObj = (range) => {
    let rangeObj = {};

    try {
        let [ unit, ranges ] = range.split('=');

        if (unit.toLowerCase() === 'bytes') {
            let [ start, end ] = ranges.split('-');
            start = parseInt(start);
            end = parseInt(end);

            if (!isNaN(start)) {
                rangeObj.start = start;
            }

            if (!isNaN(end)) {
                rangeObj.end = end;
            }
        }
    } catch(err) {
        console.error(err);
        console.log(range);
    }

    return rangeObj;
};

module.exports = async (req, res) => {
    const torrentId = req.query.url;
    let rangeObj = {};

    if (req.headers.range) {
        console.log(req.headers.range);
        rangeObj = createRangeObj(req.headers.range);
    }

    utils.getBt(torrentId, ({ file, length, }) => {
        if (rangeObj.start !== undefined) {
            if (!rangeObj.end) {
                rangeObj.end = length;
            }

            const { start, end, } = rangeObj;
            res.status(206);
            res.set({
                'Content-Type': 'video/mp4',
                'Content-Length': end - start + 1,
                'Content-Range': `bytes ${start}-${end}/${length}`,
                'Accept-Ranges': 'bytes',
            });
        }

        console.log(rangeObj);
        console.log(req.headers);
        file.createReadStream(rangeObj).pipe(res);
    });
};