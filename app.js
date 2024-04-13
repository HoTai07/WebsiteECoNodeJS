var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const config = require('./configs/config');
const axios = require('axios');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/css", express.static("dist"));

// //web
// app.use('/',cors(), require('./routes/webApi/webIndex'));
//api
app.use('/api/v1/vzconn/', require('./routes/index'));
// app.use('/users', usersRouter);


app.get('/register', cors(), (req, res) => {
  res.render('auth/register');
});

app.get('/login', cors(), (req, res) => {
  res.render('auth/login');
});

app.get('/', cors(), (req, res) => {
  let userLogin;
  if (req.cookies.token !== "null") {
    const token = req.cookies.token;
    const secretKey = config.SECRET_KEY; // Thay thế YOUR_SECRET_KEY_HERE bằng khóa bí mật của bạn

    // Giải mã chuỗi JWT
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error('Lỗi khi giải mã JWT:', err);
        userLogin = null; // Nếu có lỗi, gán userLogin thành null
      } else {
        // Nếu giải mã thành công, gán dữ liệu người dùng vào biến userLogin
        userLogin = decoded.id;
        console.log("Đã Login: " + decoded.id);
      }
    });
    axios.get('http://localhost:3000/api/v1/vzconn/user/'+ userLogin)
    .then(response => {
      const data = response.data;
      console.log(data);
      res.render('home/home-page', { user: userLogin, Name: data.data });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      res.render('error');
    });
  }
  else
  {
    userLogin = null;
    console.log("Chưa Login: "+userLogin);
    res.render('home/home-page',{ user: userLogin});
  }
 

});

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
