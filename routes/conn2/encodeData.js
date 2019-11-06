const zlib = require('zlib');

module.exports = (data) => {
    return zlib.gzipSync(JSON.stringify(data));
};