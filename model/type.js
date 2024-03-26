var mongoose = require("mongoose");

var TypeSchema = new mongoose.Schema({
    Typeid: {
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
module.exports = new mongoose.model('type', TypeSchema);