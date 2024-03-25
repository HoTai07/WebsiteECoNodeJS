const express = require('express');
const router = express.Router();
var EmployeeModel = require('../model/employee')
var PositionModel = require('../model/position')
var ResHelper = require('../helper/ResponseHelper');
const { query } = require('express');

router.get('/', async function (req, res, next) {
    try {
      // Tìm tất cả 
      const undeleted = await EmployeeModel.find({ isDeleted: false });
      res.send(undeleted);
    } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi khi truy xuất thất bại');
    }
  });

router.post('/', async function (req, res, next) {
    try {
        const position = await PositionModel.findOne({ Positionid : req.body.positionid })
        if (!position) {
            return res.status(404).json({ message: 'position not found' });
        }
        var newEmployee = new EmployeeModel({
            Personid: req.body.id,
            name: req.body.name,
            positionid: position._id,
            phonenum: req.body.phonenumber,
            password: req.body.pwd,
            Email: req.body.Email
        })
        await newEmployee.save();
        ResHelper.RenderRes(res, true, newEmployee)
    } catch (error) {
    ResHelper.RenderRes(res, false, error)
    }
  });


module.exports = router;