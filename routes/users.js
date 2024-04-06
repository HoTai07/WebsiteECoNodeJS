var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/checklogin')
var checkAuthorize = require('../middlewares/checkauthorize');
var userModel = require('../model/user')
var ResHelper = require('../helper/ResponseHelper');

router.get('/', checkLogin, checkAuthorize("admin", "user"), async function (req, res, next) {
  let users = await userModel.find({}).exec();
  console.log(req.user);
  ResHelper.RenderRes(res, true, users)
});
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


module.exports = router;
