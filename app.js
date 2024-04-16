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
app.use('/public', express.static(__dirname + '/public'));
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
      }
      else if ( req.cookies.token && (req.cookies.token !== "null") == false)
      {
        console.log("Chuột"+dataProducCMT);
        console.log(dataProduct);
        res.render('home/home-page',{ user: "", Name: "", product: dataProduct, productCMT:dataProducCMT });
      }
      else
      {
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

//Product_List
app.get('/productlist', cors(), (req, res) => {
  let dataUser ;
  let dataInfoUser;
  let dataProduct;
  let dataType;
  let userLogin;

  
    const productGet = axios.get('http://localhost:3000/api/v1/vzconn/product/')
    const TypeGet = axios.get("http://localhost:3000/api/v1/vzconn/type/")
    Promise.all([productGet, TypeGet])
      .then(responses => {
        dataProduct = responses[0].data;
        dataType = responses[1].data;
      
        console.log(dataProduct);
          

        if ( req.cookies.token && (req.cookies.token !== "null") == true) {
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
              res.render('home/product-list',{  user: dataUser, Name: dataInfoUser.data,  product: dataProduct, type: dataType});
            })
            .catch(error => {
              console.error('Error fetching data:', error);
              res.render('error');
            });
        } else if ( req.cookies.token && (req.cookies.token !== "null") == false) 
        {
          console.log(dataProduct);
          res.render('home/product-list',{  user: "", Name: "",  product: dataProduct, type: dataType});
        }
        else
        {
          console.log(dataProduct);
          res.render('home/product-list',{  user: "", Name: "",  product: dataProduct, type: dataType});
        }
      
      }).catch(error => {
        console.error('Error fetching data:', error);
        res.render('error');
      });
 
  
});

app.get('/productlist/:id', cors(), (req, res) => {
  let dataUser ;
  let dataInfoUser;
  let dataProduct;
  let dataType;
  let userLogin;

  
  console.log(req.params.id);
    const idpath = req.params.id;
    const productGet = axios.get('http://localhost:3000/api/v1/vzconn/product/'+idpath)
    const TypeGet = axios.get("http://localhost:3000/api/v1/vzconn/type/")
    Promise.all([productGet, TypeGet])
      .then(responses => {
        dataProduct = responses[0].data;
        dataType = responses[1].data;


        if ( req.cookies.token && (req.cookies.token !== "null") == true) {
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
              res.render('home/product-list',{  user: dataUser, Name: dataInfoUser.data,  product: dataProduct, type: dataType});
            })
            .catch(error => {
              console.error('Error fetching data:', error);
              res.render('error');
            });
        } else if ( req.cookies.token && (req.cookies.token !== "null") == false)
        {
          console.log(dataProduct);
          res.render('home/product-list',{  user: "", Name: "",  product: dataProduct, type: dataType});
        }
        else
        {
          console.log(dataProduct);
          res.render('home/product-list',{  user: "", Name: "",  product: dataProduct, type: dataType});
        }
      
      }).catch(error => {
        console.error('Error fetching data:', error);
        res.render('error');
      });
  
  
});

//Product_Detail
app.get('/detail/:id', cors(), (req, res) => {
  let dataUser ;
  let dataInfoUser;
  let dataProduct;
  let userLogin;

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

  let dataUser ;
  let dataInfoUser;
  let userLogin;

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
        res.render('home/order-sucess',{  user: dataUser, Name: dataInfoUser.data});
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        res.render('error');
      });
  } else {
    console.log(dataProduct);
    res.render('home/order-sucess',{  user: "", Name: ""});
  }
  // res.render('home/order-sucess');
});

//contact
app.get('/contact', cors(), (req, res) => {

  let dataUser ;
  let dataInfoUser;
  let userLogin;

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
        res.render('home/contact',{  user: dataUser, Name: dataInfoUser.data});
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        res.render('error');
      });
  } else {
    console.log(dataProduct);
    res.render('home/contact',{  user: "", Name: ""});
  }
  // res.render('home/contact');
});

//Admin
app.get('/admin/manage', cors(), (req, res) => {
  let dataUser ;
  let dataInfoUser;
  let userLogin;
  let dataAllUser;
  let dataAllProduct;

  const getProductFromAdmin = axios.get('http://localhost:3000/api/v1/vzconn/product/getproductForAdmin');
  const getUserFromAdmin = axios.get('http://localhost:3000/api/v1/vzconn/user/admin/getuser');
  Promise.all([getProductFromAdmin, getUserFromAdmin])
  .then(responses => {
    dataAllProduct = responses[0].data;
    dataAllUser = responses[1].data;

    console.log("product: "+ dataAllUser.data);

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
          console.log("ROLE:" + dataUser.data.role);
          if(dataUser.data.role  == "admin")
          {
            axios.get('http://localhost:3000/api/v1/vzconn/user/'+ userLogin)
            .then(response => {
              dataInfoUser = response.data;
              console.log(dataInfoUser);
              res.render('admin/admin',{  user: dataUser, Name: dataInfoUser.data, userlist: dataAllUser, productlist: dataAllProduct});
            })
            .catch(error => {
              console.error('Error fetching data:', error);
              res.render('error');
            });
          }
          else
          {
            res.redirect('/login');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          res.render('error');
        });
        
        
      
    } else {
      res.redirect('/login');
    }

  })
  .catch(error => {
    console.error('Error fetching data:', error);
    res.render('error');
  });

  
  // res.render('admin/admin');
  
});

//Quản lý tài khoản
app.get('/admin/account', cors(), (req, res) => {

  let dataUser ;
  let dataInfoUser;
  let userLogin;
  let dataAllUser;

  const getUserFromAdmin = axios.get('http://localhost:3000/api/v1/vzconn/user/admin/getuser/all');
  Promise.all([getUserFromAdmin])
  .then(responses => {
    dataAllUser = responses[0].data;

    console.log("product: "+ dataAllUser.data);

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
          console.log("ROLE:" + dataUser.data.role);
          if(dataUser.data.role  == "admin")
          {
            axios.get('http://localhost:3000/api/v1/vzconn/user/'+ userLogin)
            .then(response => {
              dataInfoUser = response.data;
              console.log(dataInfoUser);
              res.render('admin/user-admin',{  user: dataUser, Name: dataInfoUser.data, userlist: dataAllUser});
            })
            .catch(error => {
              console.error('Error fetching data:', error);
              res.render('error');
            });
          }
          else
          {
            res.redirect('/login');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          res.render('error');
        });
        
        
      
    } else {
      res.redirect('/login');
    }

  })
  .catch(error => {
    console.error('Error fetching data:', error);
    res.render('error');
  });

});


//Quản lý sản phẩm 

app.get('/admin/product', cors(), (req, res) => {

  let dataUser ;
  let dataInfoUser;
  let userLogin;
  let dataProductFromAdmin;

  const getProductFromAdmin = axios.get('http://localhost:3000/api/v1/vzconn/product/getproductForAdminManage');
  Promise.all([getProductFromAdmin])
  .then(responses => {
    dataProductFromAdmin = responses[0].data;

    console.log("product: "+ dataProductFromAdmin.data);

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
          console.log("ROLE:" + dataUser.data.role);
          if(dataUser.data.role  == "admin")
          {
            axios.get('http://localhost:3000/api/v1/vzconn/user/'+ userLogin)
            .then(response => {
              dataInfoUser = response.data;
              console.log(dataInfoUser);
              res.render('admin/product-admin',{  user: dataUser, Name: dataInfoUser.data, productlist: dataProductFromAdmin});
            })
            .catch(error => {
              console.error('Error fetching data:', error);
              res.render('error');
            });
          }
          else
          {
            res.redirect('/login');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          res.render('error');
        });
        
        
      
    } else {
      res.redirect('/login');
    }

  })
  .catch(error => {
    console.error('Error fetching data:', error);
    res.render('error');
  });

});

//Trang thêm sản phẩm:
app.get('/admin/AddnewProduct', cors(), (req, res) => {
  let dataUser ;
  let dataInfoUser;
  let userLogin;
  let dataType;
  axios.get('http://localhost:3000/api/v1/vzconn/type/')
  .then(response => {
    dataType = response.data;

    console.log("Loại"+dataType);
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
          console.log("ROLE:" + dataUser.data.role);
          if(dataUser.data.role  == "admin")
          {
            axios.get('http://localhost:3000/api/v1/vzconn/user/'+ userLogin)
            .then(response => {
              dataInfoUser = response.data;
              console.log(dataInfoUser);
              res.render('admin/product-add',{  user: dataUser, Name: dataInfoUser.data, Typelist: dataType});
            })
            .catch(error => {
              console.error('Error fetching data:', error);
              res.render('error');
            });
          }
          else
          {
            res.redirect('/login');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          res.render('error');
        });
        
        
      
    } else {
      res.redirect('/login');
    }

  }).catch(error => {
    console.error('Error fetching data:', error);
    res.render('error');
  });
  
});

//Forgot Password
app.get('/forgot-password', cors(), (req, res) => {
  res.render('auth/forgotPassword');
});

//Reset password
app.get('/ResetPassword', cors(), (req, res) => {
  res.render('auth/ResetPassword');
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
