var mongoose = require("mongoose");

var BillDetailSchema = new mongoose.Schema({
    Billid: {
        type: mongoose.Schema.ObjectId,
        ref: "bill",
        required: true
    },
    productid: {
        type: mongoose.Schema.ObjectId,
        ref: 'product',
        required: true
    },
    amount: Number,
    price: Number,
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
module.exports = new mongoose.model('billDetail', BillDetailSchema);