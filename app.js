'use strict';

const express = require('express');
const timeout = require('connect-timeout');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const AV = require('leanengine');
const proxy = require('http-proxy-middleware');

const app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 设置默认超时时间
app.use(timeout('600s'));

// 加载云引擎中间件
app.use(AV.express());

app.enable('trust proxy');
app.use(AV.Cloud.HttpsRedirect());

app.use(express.static('public'));

// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
// app.use(cookieParser());

const hostProxy = proxy({
  target: '**',
  followRedirects: true,
  changeOrigin: true,
  router: (req) => {
    const hostname = req.headers['host'];
    return `https://${hostname}`;
  },
  onError: (err, req, res) => {
    console.error(`host rewrite ${req.path} error`);
  },
});
app.use('/*', (req, res, next) => {
  const hostname = req.headers['x-rsshub-hostname'];

  if (hostname && hostname !== '') {
    delete req.headers['x-rsshub-hostname'];
    req.headers['host'] = hostname;
    hostProxy(req, res, next);
  } else {
    next();
  }
});

app.get('/', function(req, res) {
  res.render('index', { currentTime: new Date() });
});

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
  
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;
