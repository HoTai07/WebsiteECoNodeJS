var mongoose = require("mongoose");

var CustomerSchema = new mongoose.Schema({
    customerid: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    phonenum: String,
    Email: String,
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
module.exports = new mongoose.model('customer', CustomerSchema);