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

//Account
app.get('/register', cors(), (req, res) => {
  res.render('auth/register');
});

app.get('/login', cors(), (req, res) => {
  res.render('auth/login');
});

//Home
app.get('/', cors(), (req, res) => {
  let userLogin;
  let dataProduct;
  let dataProducCMT;
  let dataUser;

  const getProductBPC = axios.get('http://localhost:3000/api/v1/vzconn/product/BPC');
  const getProductCMT = axios.get('http://localhost:3000/api/v1/vzconn/product/CMT');

  Promise.all([getProductBPC, getProductCMT])
    .then(responses => {
      dataProduct = responses[0].data;
      dataProducCMT = responses[1].data;

      console.log("token:"+ (req.cookies.token !== "null") );
      if ((req.cookies.token !== "null") == true) {
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

        axios.get('http://localhost:3000/api/v1/vzconn/user/userRole/'+ userLogin)
          .then(response => {
            dataUser = response.data;
            console.log(dataUser);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            res.render('error');
          });

        axios.get('http://localhost:3000/api/v1/vzconn/user/'+ userLogin)
          .then(response => {
            const data = response.data;
            console.log(data);
            res.render('home/home-page', { user: dataUser, Name: data.data, product: dataProduct, productCMT:dataProducCMT });
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            res.render('error');
          });
      } else {
        console.log("Chuột"+dataProducCMT);
        console.log(dataProduct);
        res.render('home/home-page',{ user: "", Name: "", product: dataProduct, productCMT:dataProducCMT });
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      res.render('error');
    });
});

//Product_Detail
app.get('/detail/:id', cors(), (req, res) => {
  let dataUser ;
  let dataInfoUser;
  let dataProduct;
  //Xuất sản phẩm
    axios.get('http://localhost:3000/api/v1/vzconn/product/'+ req.params.id)
    .then(response => {
      dataProduct = response.data;
      console.log(dataProduct);
      if((dataProduct !== null) == true)
      {
          //Khi có/không có đăng nhập
        if ((req.cookies.token !== "null") == true) {
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
      
          axios.get('http://localhost:3000/api/v1/vzconn/user/userRole/'+ userLogin)
            .then(response => {
              dataUser = response.data;
              console.log(dataUser);
            })
            .catch(error => {
              console.error('Error fetching data:', error);
              res.render('error');
            });
      
          axios.get('http://localhost:3000/api/v1/vzconn/user/'+ userLogin)
            .then(response => {
              dataInfoUser = response.data;
              console.log(dataInfoUser);
              res.render('home/product-info',{  user: dataUser, Name: dataInfoUser.data,  product: dataProduct});
            })
            .catch(error => {
              console.error('Error fetching data:', error);
              res.render('error');
            });
        } else {
          console.log(dataProduct);
          res.render('home/product-info',{  user: "", Name: "",  product: dataProduct});
        }
      }
      else
      {
        res.redirect('/');
      }
      
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      res.render('error');
    });
  
 

  

  
});

//Bill
app.get('/ordersuccessfully', cors(), (req, res) => {
  res.render('home/order-sucess');
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
