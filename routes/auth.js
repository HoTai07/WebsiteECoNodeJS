var express = require('express');
var router = express.Router();
var userModel = require('../model/user')
var customerModel = require('../model/customer');
var employeeModel = require('../model/employee');
var PositionModel = require('../model/position');
var ResHelper = require('../helper/ResponseHelper');
var userValidator = require('../validators/users');
var { validationResult } = require('express-validator');




router.post('/login', async function (req, res, next) {
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
    ResHelper.RenderRes(res, true, result.getJWT());
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
    
    var newCustomer = new customerModel({
      customerid: GenID(10),
      name: req.body.name,
      UserId: userid._id,
      phonenum: req.body.phonenumber,
      Email: req.body.email
    }) 
    await newCustomer.save();
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});


module.exports = router;