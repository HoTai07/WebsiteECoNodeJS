const express = require('express');
const router = express.Router();
var PositionModel = require('../model/position')
var ResHelper = require('../helper/ResponseHelper');
const { query } = require('express');

router.get('/', async function (req, res, next) {
    try {
      // Tìm tất cả 
      const undeleted = await PositionModel.find({ isDeleted: false });
      res.send(undeleted);
    } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi khi truy xuất thất bại');
    }
  });

router.post('/', async function (req, res, next) {
    try {
      var newPosition = new PositionModel({
        Positionid: req.body.id,
        name: req.body.name
      })
      await newPosition.save();
      ResHelper.RenderRes(res, true, newPosition)
    } catch (error) {
      ResHelper.RenderRes(res, false, error)
    }
  });


module.exports = router;