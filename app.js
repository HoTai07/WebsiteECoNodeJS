var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/vzconn/',  require('./routes/index'));
// app.use('/users', usersRouter);

//Database config
mongoose.connect('mongodb://localhost:27017/TeamVZ').then(function () {
  console.log("conneted");
}).catch(
  function(err){
  }
)
mongoose.connection.on('disconnected',function(){
})
mongoose.connection.on('disconnecting',function(){
})
mongoose.connection.on('reconnected',function(){
})
mongoose.connection.on('open',function(){
})
mongoose.connection.on('closed',function(){
})
//
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

module.exports = app;
