const express = require('express');
const router = express.Router();
var BillModel = require('../model/bill')
var BillDetailModel = require('../model/billDetail')
var ResHelper = require('../helper/ResponseHelper');
const { query } = require('express');
var checkLogin = require('../middlewares/checklogin')
var checkAuthorize = require('../middlewares/checkauthorize');
var customerModel = require('../model/customer');
var productModel = require('../model/product')

function GenID(length){
    let source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      let rand = Math.floor(Math.random()*61);
      result+=source[rand];
    }
    return result;
  }

router.post('/createNew', checkLogin, checkAuthorize("user"), async function (req, res, next) {

    let customer = await customerModel.findOne({ UserId: req.user._id });
    if(customer)
    {

        const currentDate = new Date();
        // Định dạng ngày tháng và thời gian theo DMYHIMS
        const formattedDateTime = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
        
        // const currentDate = new Date();
        var newbill = new BillModel({
            Billid:  formattedDateTime+GenID(10),
            customerid: customer._id,
            dateOrder: Date.now(),
            TotalBill: 0
          })
          await newbill.save();
        ResHelper.RenderRes(res, true, "Tạo bill thành công")
    }
    else
    {
        ResHelper.RenderRes(res, false, "Không tồn tại khách hàng này")
    }
    
  });

router.post('/intobill', checkLogin, checkAuthorize("user"), async function (req, res, next) {

    let customer = await customerModel.findOne({ UserId: req.user._id });
    if(customer)
    {
        var billIs = await BillModel.findOne({ customerid: customer._id , TotalBill: 0}, { sort: { _id: -1 } });
        if(billIs)
        {
            //Tìm sản phẩm với ID tương tự
            var checkproduct = await productModel.findOne({ productid: req.body.IdProduct, isDeleted: false });
            console.log(req.body.IdProduct);
            try{
              if(checkproduct)
              {
                const productPrice = checkproduct.price;
                var billDetailInfo  = new BillDetailModel({
                  Billid: billIs._id,
                  productid: checkproduct._id,
                  amount: 1,
                  price: 1* productPrice
                  
                })
                await billDetailInfo.save();

                //Cập nhật tổng bill
                billIs.TotalBill = 1*productPrice;
                await billIs.save();

                const updateSLT = checkproduct.SLT - 1
                console.log(updateSLT);
                if(updateSLT == 0)
                {
                  checkproduct.SLT = updateSLT;
                  checkproduct.isDeleted = true;
                }
                else
                {
                  checkproduct.SLT = updateSLT;
                }
                await checkproduct.save();
                
                ResHelper.RenderRes(res, true, "Tạo hóa đơn thành công!")
              }
              else
              {
                ResHelper.RenderRes(res, false, "Sản phẩm đã hết hoặc không tồn tại")
              }
            }catch (error)
            {
              ResHelper.RenderRes(res, false, "Lỗi trong quá trình tạo đơn hàng, vui lòng liên hệ sau!")
            }
        }
        else
        {
            ResHelper.RenderRes(res, false, "Hóa đơn mới không tồn tại")
        }
    }
    else
    {
        ResHelper.RenderRes(res, false, "Không tồn tại khách hàng này")
    }
    
  });


module.exports = router;