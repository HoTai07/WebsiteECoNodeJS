var express = require('express');
var router = express.Router();
var userModel = require('../model/user')
var customerModel = require('../model/customer');
var employeeModel = require('../model/employee');
var PositionModel = require('../model/position');
var ResHelper = require('../helper/ResponseHelper');
var userValidator = require('../validators/users');
var { validationResult } = require('express-validator');
var checkLogin = require('../middlewares/checklogin');
const config = require('../configs/config');
var sendmail = require('../helper/sendMail');




router.post('/login', async function (req, res, next) {
  let userLogin;
  var result = await userModel.GetCre(req.body.username, req.body.password);
  if(result.role == 'user')
  {
    var userInfomationDetail = await customerModel.findOne({ UserId : result._id })
    console.log(userInfomationDetail);
  }
  else if(result.role == 'admin')
  {
    var employeeInfomationDetail = await employeeModel.findOne({ UserId : result._id })
    console.log(employeeInfomationDetail);
    
  }

  if (result.error) {
    ResHelper.RenderRes(res, false, result.error);
  } else {
    res.status(200)
      .cookie('token', result.getJWT(), {
        expires: new Date(Date.now + 24 * 3600 * 1000),
        httpOnly: true
      })
      .send({
        success: true,
        data: result.getJWT()
      }
      );
    //ResHelper.RenderRes(res, true, result.getJWT());

  }

 
});

function GenID(length){
  let source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    let rand = Math.floor(Math.random()*61);
    result+=source[rand];
  }
  return result;
}


router.post('/register', userValidator.checkChain(), async function (req, res, next) {
  var result = validationResult(req);
  if (result.errors.length > 0) {
    ResHelper.RenderRes(res, false, result.errors);
    return;
  }
  console.log(req.body);
  try {
    var newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      role: ["user"]
    })
    await newUser.save();
    ResHelper.RenderRes(res, true, newUser.getJWT())
    const userid = await userModel.findOne({ username : req.body.username })
    if (!userid) {
        return res.status(404).json({ message: 'account not found' });
    }


    // const undeleted = await EmployeeModel.find({ isDeleted: false });
    // if(undeleted.length === 0)
    // {
    //   const position = await PositionModel.findOne({ Positionid : req.body.positionid })
    //   if (!position) {
    //       return res.status(404).json({ message: 'position not found' });
    //   }
      
  
    //   var newEmployee = new employeeModel({
    //     Personid: GenID(10),
    //     name: req.body.name,
    //     positionid: position._id,
    //     UserId: userid._id,
    //     phonenum: req.body.phonenumber,
    //     Email: req.body.email
    //   })
    //   await newEmployee.save();
    // }
    
    // Lấy ngày tháng hiện tại
    const currentDate = new Date();

    // Định dạng ngày tháng và thời gian theo DMYHIMS
    const formattedDateTime = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    var newCustomer = new customerModel({
      customerid: formattedDateTime+ GenID(10),
      name: req.body.fullname,
      UserId: userid._id,
      phonenum: req.body.phonenumber,
      Email: req.body.email
    }) 
    await newCustomer.save();
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});


router.post('/logout', checkLogin, function (req, res, next) {
  if (req.cookies.token) {
    res.status(200)
      .cookie('token', "null", {
        expires: new Date(Date.now + 1000),
        httpOnly: true
      })
      .send({
        success: true,
        data: "Đã log out thành công"
      }
      );
  }
});

router.post("/forgotPassword", userValidator.checkmail(), async function (req, res, next) {
  const resultvalidate = validationResult(req);
  if (resultvalidate.errors.length > 0) {
    ResHelper.RenderRes(res, false, resultvalidate.errors);
    return;
  }
  try{
    var userIn = await customerModel.findOne({
      Email: req.body.email
    })

  }catch(error)
  {
    var userIn = await employeeModel.findOne({
      Email: req.body.email
    })
  }
  if (userIn) {
    
    var user = await userModel.findOne({ _id: userIn.UserId });
    console.log(user);
   
    
    let token = user.genTokenResetPassword();
    
    await user.save()
    try {
      let url = `http://${config.hostName}/api/v1/vzconn/auth/ResetPassword/${token}`;
      let message = `click zo url de reset passs: ${url}`
      console.log(userIn.Email);
      sendmail(message, userIn.Email)
      ResHelper.RenderRes(res, true, "Thanh cong");
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExp = undefined;
      await user.save();
      ResHelper.RenderRes(res, false, error);
    }
  } else {
    ResHelper.RenderRes(res, false, "email khong ton tai");
  }

})

router.post("/ResetPassword/:token", userValidator.checkPass(),async function (req, res, next) {
  const resultvalidate = validationResult(req);
  console.log(resultvalidate);
  if (resultvalidate.errors.length > 0) {
    ResHelper.RenderRes(res, false, resultvalidate.errors);
    return;
  }
  var user = await userModel.findOne({
    resetPasswordToken: req.params.token
  })
  if (user) {
    if (user.resetPasswordExp > Date.now()) {
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExp = undefined;
      await user.save();
      ResHelper.RenderRes(res, true, "Reset thanh cong");
    } else {
      ResHelper.RenderRes(res, false, "URL het han");
    }
  } else {
    ResHelper.RenderRes(res, false, "URL khong hop le");
  }

});

router.post('/ChangePassword', checkLogin, userValidator.checkPass() , async function (req, res, next) {
  const resultvalidate = validationResult(req);
  console.log(resultvalidate);
  if (resultvalidate.errors.length > 0) {
    ResHelper.RenderRes(res, false, resultvalidate.errors);
    return;
  }
  if (req.cookies.token) {
    const userinfo = req.user;
    let user = await userModel.findById(userinfo._id);
    if(user)
    {
      const bcrypt = require('bcrypt');
        const match = await bcrypt.compare(req.body.password, user.password);
      if(match)
      {
        ResHelper.RenderRes(res, false, "Vui lòng nhập password khác hiện tại");
      }
      else
      {
        user.password = req.body.password
        await user.save();
        ResHelper.RenderRes(res, true, "Doi password thanh cong");
       
      }
    }
  }else {
    ResHelper.RenderRes(res, false, "URL khong hop le");
  }
});

module.exports = router;