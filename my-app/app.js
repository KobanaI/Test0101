// import createError from 'http-errors';
// import express from 'express';
// import path from 'path';

// import cookieParser from 'cookie-parser';
// import logger from 'morgan';
// import helmet from 'helmet';
// import session from 'express-session';
// import csurf from 'tiny-csrf';
// import crypto from 'crypto';


// import indexRouter from './routes/index.js';
// import compositionRouter from './routes/composition.js';
// import resultRouter from './routes/result.js';

// const app = express();
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
// app.use(helmet());


// // view engine setup

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('zenstudy_signed_cookies'));
// //app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// const csurfsetting =   csurf(
//   'zenstudysecretsecret987654323456',
//   ['POST'],
//   [/.*\/(composition|process-file).*/i]
// )
// app.use(cookieParser('zenstudy_signed_cookies'));
// app.use(csurfsetting)

// app.use('/complete_images', express.static(path.join(__dirname, 'complete_images')));

// app.use(session({
//   secret: 'your-secret-key', // 任意のシークレットキー
//   resave: false, 
//   saveUninitialized: true,
//   cookie: { secure: false } 
// }));


// const randomSecret = crypto.randomBytes(64).toString('hex');

// //randomSecretになってしまってないか、確認する必要がある
// //.envに設定したものを使う
// app.use(session({
//   secret: process.env.SESSION_SECRET || randomSecret,
//   resave: false, 
//   saveUninitialized: true,
//   cookie: { 
//     secure: false,
//     maxAge: 60 * 60 * 1000 // 1時間でデータがなくなる
//   }
// }));


// app.use('/', indexRouter);
// app.use('/composition', compositionRouter);
// app.use('/result', resultRouter);


// //エラー処理
// app.use(function(req, res, next) {
//   next(createError(404));
// });
// app.use(function(err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   res.status(err.status || 500);
//   res.render('error');
// });



// const port = process.env.PORT || 4000;
// app.listen(port, () => {
//   console.log(`サーバ起動！ポートは ${port}`);
// });

// export default app;

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import csurf from 'tiny-csrf';
import crypto from 'crypto';
import dotenv from 'dotenv';

import indexRouter from './routes/index.js';
import compositionRouter from './routes/composition.js';
import resultRouter from './routes/result.js';

// 環境変数の読み込み
dotenv.config();

const app = express();

// __dirname 設定（Windows対応）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// セキュリティ強化
app.use(helmet());

// ビューエンジン設定
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 基本的なミドルウェア
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('zenstudy_signed_cookies'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/complete_images', express.static(path.join(__dirname, 'complete_images')));

// CSRF設定
const csurfsetting = csurf(
  'zenstudysecretsecret987654323456',
  ['POST'],
  [/.*\/(composition|process-file).*/i]
);
app.use(csurfsetting);

// セッション設定
const randomSecret = crypto.randomBytes(64).toString('hex');

app.use(
  session({
    secret: process.env.SESSION_SECRET || randomSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // HTTPS 使用時に true に変更
      maxAge: 60 * 60 * 1000, // 1時間でセッションデータ削除
    },
  })
);

// ルート設定
app.use('/', indexRouter);
app.use('/composition', compositionRouter);
app.use('/result', resultRouter);

// 404エラーハンドラ
app.use((req, res, next) => {
  next(createError(404));
});

// その他エラーハンドリング
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// サーバー起動
const port = 4000 || 4000;
app.listen(port, () => {
  console.log(`サーバ起動！ポートは ${port}`);
});

export default app;
