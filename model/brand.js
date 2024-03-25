var mongoose = require("mongoose");

var BrandSchema = new mongoose.Schema({
    Brandid: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
module.exports = new mongoose.model('brand', BrandSchema);