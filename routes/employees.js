const express = require('express');
const router = express.Router();
var EmployeeModel = require('../model/employee')
var PositionModel = require('../model/position')
var UserModel = require('../model/user')
var ResHelper = require('../helper/ResponseHelper');
const { query } = require('express');
var checkLogin = require('../middlewares/checklogin')
var checkAuthorize = require('../middlewares/checkauthorize');


router.get('/profile', checkLogin, checkAuthorize("admin"), async function (req, res, next) {
  try {
    // Tìm tất cả 
    const undeleted = await EmployeeModel.findOne({ UserId: req.user._id });
    res.send(undeleted);
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi truy xuất thất bại');
  }
});


router.get('/', checkLogin, checkAuthorize("admin"), async function (req, res, next) {
    try {
      // Tìm tất cả 
      const undeleted = await EmployeeModel.find({ isDeleted: false });
      res.send(undeleted);
    } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi khi truy xuất thất bại');
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

router.post('/', checkLogin, checkAuthorize("admin"), async function (req, res, next) {
    try {
        const position = await PositionModel.findOne({ Positionid : req.body.positionid })
        if (!position) {
            return res.status(404).json({ message: 'position not found' });
        }
        const user = await UserModel.findOne({ username : req.body.username })
        if (!user) {
            return res.status(404).json({ message: 'user not available' });
        }
        var newEmployee = new EmployeeModel({
            Personid: GenID(10),
            name: req.body.name,
            positionid: position._id,
            UserId: user._id,
            phonenum: req.body.phonenumber,
            Email: req.body.Email
        })
        await newEmployee.save();
        ResHelper.RenderRes(res, true, newEmployee)
    } catch (error) {
    ResHelper.RenderRes(res, false, error)
    }
  });


module.exports = router;