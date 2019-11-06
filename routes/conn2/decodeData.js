const zlib = require('zlib');

module.exports = (buf) => {
    return JSON.parse(zlib.gunzipSync(buf).toString());
};