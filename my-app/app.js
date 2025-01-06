const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet')
const session = require('express-session');
const csurf = require('tiny-csrf');

const indexRouter = require('./routes/index');
const compositionRouter = require('./routes/composition');
const resultRouter = require('./routes/result');

const app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('zenstudy_signed_cookies'));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const csurfsetting =   csurf(
  'zenstudysecretsecret987654323456',
  ['POST'],
  [/.*\/(composition|process-file).*/i]
)
app.use(cookieParser('zenstudy_signed_cookies'));
app.use(csurfsetting)

app.use('/complete_images', express.static(path.join(__dirname, 'complete_images')));

app.use(session({
  secret: 'your-secret-key', // 任意のシークレットキー
  resave: false, // セッションが変更されていない場合は再保存しない
  saveUninitialized: true, // 初期化されていないセッションを保存
  cookie: { secure: false } // HTTPS環境ではtrueにする
}));



app.use('/', indexRouter);
app.use('/composition', compositionRouter);
app.use('/result', resultRouter);


//エラー処理
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`サーバ起動！ポートは ${port}`);
});

module.exports = app;
