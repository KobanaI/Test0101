const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const compositionRouter = require('./routes/composition');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/result", (req, res) => {
  const fileUrl = req.query.path; // クエリパラメータを取得
  console.log("Rendering result page with fileUrl:", fileUrl);
  res.render("result", { filepath: fileUrl });
});

app.use('/', indexRouter);
app.use('/composition', compositionRouter);
app.use('/users', usersRouter);

app.use('/complete_images', express.static(path.join(__dirname, 'complete_images')));
app.use(express.static(path.join(__dirname, 'complete_images')));

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
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
