var mongoose = require("mongoose");

var BillSchema = new mongoose.Schema({
    Billid: {
        type: String,
        required: true,
        unique: true
    },
    customerid:{
        type: mongoose.Schema.ObjectId,
        ref: "customer"
    },
    dateOrder: {
        type: Date,
        default: Date.now // Sử dụng giá trị mặc định là ngày hiện tại khi tạo mới
    },
    TotalBill: Number,
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
module.exports = new mongoose.model('bill', BillSchema);