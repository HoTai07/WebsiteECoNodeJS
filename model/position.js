var mongoose = require("mongoose");

var PositionSchema = new mongoose.Schema({
    Positionid: {
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
module.exports = new mongoose.model('position', PositionSchema);