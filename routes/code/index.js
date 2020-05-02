let code = '';

module.exports = async (ws, req) => {
    ws.on('message', (info) => {
        const data = JSON.parse(info);

        if (data.type == '1') {
            // push
            code = data.code;
        } else if (data.type == '2') {
            // get
            ws.send(JSON.stringify({
                code,
            }));
            code = '';
        }
    });
};
