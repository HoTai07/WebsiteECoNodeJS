const express = require('express');
const router = express.Router();
var BrandModel = require('../model/brand')
var ResHelper = require('../helper/ResponseHelper');
const { query } = require('express');

router.get('/', async function (req, res, next) {
    try {
      // Tìm tất cả 
      const undeleted = await BrandModel.find({ isDeleted: false });
      res.send(undeleted);
    } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi khi truy xuất thất bại');
    }
  });

router.post('/', async function (req, res, next) {
    try {
      var newbrand = new BrandModel({
        Brandid: req.body.id,
        name: req.body.name
      })
      await newbrand.save();
      ResHelper.RenderRes(res, true, newbrand)
    } catch (error) {
      ResHelper.RenderRes(res, false, error)
    }
  });


module.exports = router;