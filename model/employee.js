var mongoose = require("mongoose");

var EmployeeSchema = new mongoose.Schema({
    Personid: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    positionid: {  // Tham chiếu 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'position'
    },
    phonenum: String,
    password: String,
    Email: String,
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
module.exports = new mongoose.model('employee', EmployeeSchema);