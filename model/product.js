var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    productid: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    image: String,
    title: String,
    price: Number,
    Brandid: {  // Tham chiếu đến BrandSchema thông qua Brandid
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand'
    },
    Typeid: {  // Tham chiếu đến BrandSchema thông qua Brandid
        type: mongoose.Schema.Types.ObjectId,
        ref: 'type'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
module.exports = new mongoose.model('product', productSchema);