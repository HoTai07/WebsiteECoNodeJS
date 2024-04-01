const express = require('express');
const router = express.Router();
var BillModel = require('../model/bill')
var BillDetailModel = require('../model/billDetail')
var ResHelper = require('../helper/ResponseHelper');
const { query } = require('express');




module.exports = router;