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
var sendNrequest = require('./ping_service')

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
//redis
redisClient.on('ready',function() {
  console.log("Redis is ready");
 });

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
//main ping call function to find avg, min and max
function pingcall(arr)
{
  let arrMin = Math.min(...arr);
  let arrMax = Math.max(...arr);
  let arrAvg = arr.reduce((a,b) => a + b, 0) / arr.length;
  console.log(arrMin,arrMax,arrAvg,callCount);
  redis_key = callCount%50
  new_redis_key = redis_key.toString()
  redisClient.hmset(new_redis_key,"min",arrMin,"max",arrMax,"average",arrAvg,function(err,reply){
    console.log(err);
    console.log(reply);
   });
   redisClient.hgetall(new_redis_key,function(err,reply) {
    console.log(err);
    console.log(reply);
   });
}
// redisClient.hmset("tools","webserver","expressjs","database","mongoDB","devops","jenkins",function(err,reply){
//   console.log(err);
//   console.log(reply);
//  });
//  redisClient.hgetall("tools",function(err,reply) {
//   console.log(err);
//   console.log(reply);
//  });
var callCount = 1;
sendNrequest(10,'https://dog.ceo/api/breeds/image/random',pingcall)
//continuously executing the same function multiple times with a specific timer.

var repeater = setInterval(function () {
  if (callCount < 10) {
    sendNrequest(10,'https://dog.ceo/api/breeds/image/random',pingcall)
    callCount += 1;
    console.log(callCount);
  } else {
    clearInterval(repeater);
  }
}, 10000);

// var pingdata = {
//   ping : []
// }
// //filling dummy ping data
// for (i = 0; i < 1000; i++) {
//   pingdata.ping.push(i)
// }



// redisClient.rpush(['ping',1,2,3,4],function(err,reply) {
//   console.log(err);
//   console.log(reply[1]);
//  });
// redisClient.lrange('frameworks', 0, -1, function(err, reply) {
//   console.log(reply); // ['angularjs', 'backbone']
// });
 

redisClient.on('error',function() {
 console.log("Error in Redis");
});

module.exports = app;
