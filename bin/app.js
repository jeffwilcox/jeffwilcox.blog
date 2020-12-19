var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

const pkg = require('./package.json');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.dir(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.send(err.message || err)
  // res.render('error');
});

module.exports = app;