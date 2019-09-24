'use strict';

const rp = require('request-promise');

module.exports = (req, res) => {
    try {
        const { ref } = req.body;

        if (ref === 'refs/heads/master') {
            rp.post({
                uri: `${process.env.DEPLOY_URL}`
            }).catch((err) => {
                console.error(err);
            });
        }
    } catch (err) {
        console.error(err);
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send({
        result: 'OK ' + new Date(),
        msg: 'deploy'
    });
};