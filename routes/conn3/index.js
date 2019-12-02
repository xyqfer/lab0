const { parse } = require('url');
const net = require('net');
const { Writable, Readable } = require('stream');
const encodeData = require('./encodeData');
const decodeData = require('./decodeData');
const encodeBuffer = require('./encodeBuffer');
const decodeBuffer = require('./decodeBuffer');

const getKey = ({ id, connectUrl, }) => {
    return `${id}+${connectUrl}`;
};

let socketMap = new Map();
let respList = [];

const generateConnection = async ({ hostname, port, }) => {
    return await new Promise((resolve, reject) => {
        const connection = net.connect(port, hostname, () => {
            console.log(`${hostname}:${port} connected`)
            resolve(connection);
        });
    });
};

module.exports = async (req, res) => {
    const { data } = req.body;

    data.forEach(async (item) => {
        try {
            const { type, id, connectUrl, payload, } = decodeData(decodeBuffer(item));
            const key = getKey({ id, connectUrl, });

            if (type == 1) {
                const { hostname, port, } = parse(`http://${connectUrl}`);
                const pSocket = await generateConnection({
                    hostname,
                    port,
                });

                pSocket.on('error', (err) => {
                    console.log('pSocket err', err);
                    console.log(err);
                });
                pSocket.on('close', () => {
                    socketMap.delete(key);
                });

                const wsReadable = new Readable({
                    read(size) { },
                });
                wsReadable.on('data', (data) => {
                    // console.log('wsReadable data ', data.length);
                });
                wsReadable.pipe(pSocket);

                const wsWritable = new Writable({
                    write(chunk, encoding, callback) {
                        // console.log('wsWritable write ', chunk.length);
                        respList.push(encodeBuffer(encodeData({
                            type: 4,
                            id,
                            connectUrl,
                            payload: encodeBuffer(chunk),
                        })));
                        callback();
                    },
                });
                wsWritable.on('data', (data) => {
                    // console.log('wsWritable data ', data.length);
                });
                pSocket.pipe(wsWritable);

                socketMap.set(key, {
                    pSocket,
                    wsReadable,
                    wsWritable,
                });

                respList.push(encodeBuffer(encodeData({
                    type: 3,
                    id,
                    connectUrl,
                })));
                return;
            }

            if (type == 2) {
                const socketItem = socketMap.get(key);
                if (socketItem) {
                    const { wsReadable, } = socketItem;
                    wsReadable.push(decodeBuffer(payload));
                }
                return;
            }
        } catch(err) {
            console.log(err);
        }
    });

    res.json({
        data: [...respList],
    });
    respList = [];
};