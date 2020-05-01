let localSignal = [];
let remoteSignal = [];

module.exports = async (ws, req) => {
    ws.on('message', (info) => {
        const data = JSON.parse(info);

        if (data.type == '1') {
            // push
            let source = data.src == 'local' ? localSignal : remoteSignal;

            while (data.payload.length > 0) {
                source.push(data.payload.shift());
            }
        } else if (data.type == '2') {
            // get
            let source = data.src == 'local' ? remoteSignal : localSignal;
            let signals = [];

            while (source.length > 0) {
                signals.push(source.shift());
            }

            if (signals.length > 0) {
                ws.send(JSON.stringify({
                    signals,
                }));
            }
        }
    });
};
