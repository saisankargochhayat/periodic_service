var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var redis = require('redis');
var redisClient = redis.createClient({host : 'localhost', port : 6379});
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//redis
redisClient.on('ready',function() {
 console.log("Redis is ready");
});

redisClient.rpush(['ping',1,2,3,4],function(err,reply) {
  console.log(err);
  console.log(reply[1]);
 });
redisClient.lrange('frameworks', 0, -1, function(err, reply) {
  console.log(reply); // ['angularjs', 'backbone']
});
 

redisClient.on('error',function() {
 console.log("Error in Redis");
});

module.exports = app;