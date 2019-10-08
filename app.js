'use strict';

const express = require('express');
const timeout = require('connect-timeout');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const AV = require('leanengine');
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

app.use(express.static('public'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(cookieParser());

app.use(cors({
  origin: '*',
}));

app.use((req, res, next) => {
  const ipAddress = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`${req.originalUrl}, user IP: ${ipAddress}`);
  next();
});

app.use(
  '/',
  proxy({ 
      target: 'https://web.telegram.org',
      selfHandleResponse : true,
      changeOrigin: true,
      onProxyRes: (proxyRes, req, res) => {
          let body = [];
          proxyRes.on('data', function (chunk) {
              body.push(chunk);
          });
          proxyRes.on('end', function () {
              body = Buffer.concat(body)
              if (!proxyRes.headers["content-type"].startsWith('image/')) {
                body = body.toString();
              }

              if (req.url === '/') {
                const HEAD_START_LABEL = '<head>';
                const injectData = `
                    <script>
                        !function(t){function n(e){if(r[e])return r[e].exports;var i=r[e]={exports:{},id:e,loaded:!1};return t[e].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t,n,r){r(1)(window)},function(t,n){t.exports=function(t){var n="RealXMLHttpRequest";t.hookAjax=function(t){function r(n){return function(){var r=this.hasOwnProperty(n+"_")?this[n+"_"]:this.xhr[n],e=(t[n]||{}).getter;return e&&e(r,this)||r}}function e(n){return function(r){var e=this.xhr,i=this,o=t[n];if("function"==typeof o)e[n]=function(){t[n](i)||r.apply(e,arguments)};else{var u=(o||{}).setter;r=u&&u(r,i)||r;try{e[n]=r}catch(t){this[n+"_"]=r}}}}function i(n){return function(){var r=[].slice.call(arguments);if(!t[n]||!t[n].call(this,r,this.xhr))return this.xhr[n].apply(this.xhr,r)}}return window[n]=window[n]||XMLHttpRequest,XMLHttpRequest=function(){var t=new window[n];for(var o in t){var u="";try{u=typeof t[o]}catch(t){}"function"===u?this[o]=i(o):Object.defineProperty(this,o,{get:r(o),set:e(o),enumerable:!0})}this.xhr=t},window[n]},t.unHookAjax=function(){window[n]&&(XMLHttpRequest=window[n]),window[n]=void 0},t.default=t}}]);
                    </script>
                    <script>
                        (() => {
                            hookAjax({
                                open: function(arg, xhr) {
                                    console.log(xhr);
                                    console.log("open called: method:%s,url:%s,async:%s",arg[0],arg[1],arg[2])
                                    let originUrl = arg[1];
                                    let url = new URL(originUrl);

                                    if (url.hostname === "venus.web.telegram.org") {
                                      arg[1] = "${process.env.TG_VENUS_URL}" + url.pathname;
                                    }
                                }
                            });
                        })();
                    </script>
                `;
                const beforeHeadStarts = body.indexOf(HEAD_START_LABEL) + HEAD_START_LABEL.length;
                body = body.slice(0, beforeHeadStarts) + injectData + body.slice(beforeHeadStarts);
              }
              res.setHeader("content-type", proxyRes.headers["content-type"])
              res.send(body);

              console.log(req.url);
          });
      },
  })
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
