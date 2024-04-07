var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/checklogin')
var checkAuthorize = require('../middlewares/checkauthorize');
var userModel = require('../model/user')
var ResHelper = require('../helper/ResponseHelper');
var customerModel = require('../model/customer');

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


module.exports = router;
