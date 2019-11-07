const http = require('http');
const net = require('net');
const url = require('url');

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        console.log('enter /');
        res.statusCode = 200;
        res.end();
    } else {
        console.log('enter 404');
        res.statusCode = 404;
        res.end();
    }
 });
server.on('connect', (req, cSock) => {
    const connectUrl = req.url;
    console.log('server connect ', connectUrl);

    var u = url.parse('http://' + connectUrl);

    var pSock = net.connect(u.port, u.hostname, function () {
        cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        pSock.pipe(cSock);
    }).on('error', (e) => {
        cSock.end();
    });

    cSock.pipe(pSock);
});

const PORT = process.env.LEANCLOUD_APP_PORT;
server.listen(PORT);
console.log(`listening on port ${PORT}`);

