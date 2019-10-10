'use strict';

const express = require('express');
const timeout = require('connect-timeout');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const AV = require('leanengine');
const expressWs = require('express-ws');
const { Writable, Readable, } = require('stream');
const proxy = require('http-proxy-middleware');

// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require('./cloud');

const app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 设置默认超时时间
app.use(timeout('600s'));

// 加载云引擎中间件
app.use(AV.express());

app.enable('trust proxy');
// 需要重定向到 HTTPS 可去除下一行的注释。
app.use(AV.Cloud.HttpsRedirect());

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '100mb'}));
app.use(cookieParser());

app.use(cors({
  origin: '*',
}));

app.use((req, res, next) => {
  const ipAddress = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`${req.originalUrl}, user IP: ${ipAddress}`);
  next();
});

const { parse } = require('url');
const net = require('net');
const CONNECTION_POOL = new Map();

const getConnection = async ({ hostname, port, }) => {
  const CONNECTION_NAME = `${hostname}:${port}`;
  if (CONNECTION_POOL.has(CONNECTION_NAME)) {
    return CONNECTION_POOL.get(CONNECTION_NAME);
  }

  const { connection, fromPool, } = await new Promise((resolve, reject) => {
    const connection = net.connect(port, hostname, () => {
      console.log(`${CONNECTION_NAME} connected`)
      if (!CONNECTION_POOL.has(CONNECTION_NAME)) {
        CONNECTION_POOL.set(CONNECTION_NAME, connection);
        resolve({
          connection,
        });
      } else {
        resolve({
          connection: CONNECTION_POOL.get(CONNECTION_NAME),
          fromPool: true,
        })
      }
    });
  });

  if (!fromPool) {
    connection.on('end', (a) => {
      console.log(`${CONNECTION_NAME} end`);
      console.log(a)
      if (CONNECTION_POOL.has(CONNECTION_NAME)) {
        CONNECTION_POOL.delete(CONNECTION_NAME);
      }
    });
    connection.on('error', function (err) {      
      console.log(`${CONNECTION_NAME} error`);
      if (CONNECTION_POOL.has(CONNECTION_NAME)) {
        CONNECTION_POOL.delete(CONNECTION_NAME);
      }
    });
  }

  return connection;
};

expressWs(app);
app.ws('/conn', async function(ws, req) {
  const connectUrl = req.query['xx-connect-url'];
  const { hostname, port, } = parse(`http://${connectUrl}`);

  const pSocket = await getConnection({
    hostname,
    port,
  });

  const wsReadable = new Readable({
    read(size) {},
  });
  wsReadable.on('data', (data) => {
    console.log('wsReadable data ', data.length);        
  });
  wsReadable.pipe(pSocket);

  const wsWritable = new Writable({
    write(chunk, encoding, callback) {
        console.log('wsWritable write ', chunk.length);
        ws.send(chunk);
        callback();
    },
  });
  wsWritable.on('data', (data) => {
    console.log('wsWritable data ', chunk.length);
  });
  pSocket.pipe(wsWritable);

  ws.on('message', function(data) {
    console.log('ws message ', data.length);
    wsReadable.push(data);
  });
});

app.use(
  '/orig',
  proxy({ 
      target: 'https://www.google.com.hk',
      changeOrigin: true,
      pathRewrite: function (path, req) {
        return path.replace(/^\/orig\//, '');
      },
      router: function(req) {
        const u = new URL(req.url.replace(/^\/orig\//, ''));
        return u.origin;
      },
  }),
);


app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function(err, req, res, next) {
  if (req.timedout && req.headers.upgrade === 'websocket') {
    // 忽略 websocket 的超时
    return;
  }

  var statusCode = err.status || 500;
  if (statusCode === 500) {
    console.error(err.stack || err);
  }
  if (req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // 默认不输出异常详情
  var error = {};
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
});

module.exports = app;
