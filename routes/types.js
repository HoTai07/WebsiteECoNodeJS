const express = require('express');
const router = express.Router();
var TypeModel = require('../model/type')
var ResHelper = require('../helper/ResponseHelper');
const { query } = require('express');

router.get('/', async function (req, res, next) {
    try {
      // Tìm tất cả  
      const undeleted = await TypeModel.find({ isDeleted: false });
      res.send(undeleted);
    } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi khi truy xuất thất bại');
    }
  });

router.post('/', async function (req, res, next) {
    try {
      var newtype = new TypeModel({
        Typeid: req.body.id,
        name: req.body.name
      })
      await newtype.save();
      ResHelper.RenderRes(res, true, newtype)
    } catch (error) {
      ResHelper.RenderRes(res, false, error)
    }
  });


module.exports = router;