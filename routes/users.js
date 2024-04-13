var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/checklogin')
var checkAuthorize = require('../middlewares/checkauthorize');
var userModel = require('../model/user')
var ResHelper = require('../helper/ResponseHelper');
var customerModel = require('../model/customer');
var employeeModel = require('../model/employee');

router.get('/', checkLogin, checkAuthorize("user"), async function (req, res, next) {
  let users = await userModel.find({}).exec();
  console.log(req.user);
  ResHelper.RenderRes(res, true, users)
});

router.get('/profile', checkLogin, checkAuthorize("user"), async function (req, res, next) {
  let customer = await customerModel.findOne({ UserId: req.user._id });
  console.log(req.user);
  ResHelper.RenderRes(res, true, customer)
});
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.get('/:id', async function (req, res, next) {
  let username = await userModel.findOne({ _id: req.params.id });
  if(username.role == 'user')
  {
    var userInfomationDetail = await customerModel.findOne({ UserId : username._id })
    console.log(userInfomationDetail);
    ResHelper.RenderRes(res, true, userInfomationDetail)
  }
  else if(username.role == 'admin')
  {
    var employeeInfomationDetail = await employeeModel.findOne({ UserId : username._id })
    console.log(employeeInfomationDetail);
    ResHelper.RenderRes(res, true, employeeInfomationDetail)
    
  }
  
});


router.get('/userRole/:id', async function (req, res, next) {
  let username = await userModel.findOne({ _id: req.params.id });
  
    ResHelper.RenderRes(res, true, username)
 
 
    
  
});

module.exports = router;
