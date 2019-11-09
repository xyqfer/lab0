// const http = require('http');
// const net = require('net');
// const url = require('url');

// const server = http.createServer((req, res) => {
//     if (req.url == '/') {
//         console.log('enter /');
//         res.statusCode = 200;
//         res.end();
//     } else {
//         console.log('enter 404');
//         res.statusCode = 404;
//         res.end();
//     }
//  });
// server.on('connect', (req, cSock) => {
//     const connectUrl = req.url;
//     console.log('server connect ', connectUrl);

//     var u = url.parse('http://' + connectUrl);

//     var pSock = net.connect(u.port, u.hostname, function () {
//         cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
//         pSock.pipe(cSock);
//     }).on('error', (e) => {
//         cSock.end();
//     });

//     cSock.pipe(pSock);
// });

var net = require('net');

var server = net.createServer(function (socket) {
    console.log('1111');
    socket.on('data', (buffer) => {
        console.log('socket data ', buffer.length);
        const str = buffer.toString();
        console.log(str);

        if (str.includes('/1.1/functions/_ops/metadatas')) {
            socket.end('HTTP/1.1 404 NOT FOUND\r\n\r\n');
        } else {
            if (str.includes('-core-engine-cell-')) {
                socket.end('HTTP/1.1 200 OK\r\n\r\n');
            } else {
                // socket.write('HTTP/1.1 200 OK\r\n\r\n');
                // socket.end('xxxxxxxxxxxx');
                let s = '';
                for (let i = 0; i < 65536; i++) {
                    s += 'x';
                }
                socket.write(s);
                // socket.end();
            }
        }
    });
    // socket.pipe(socket);
});

const PORT = process.env.LEANCLOUD_APP_PORT || 8989;
server.listen(PORT);
console.log(`listening on port ${PORT}`);

