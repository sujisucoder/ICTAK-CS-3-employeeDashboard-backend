const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
    name:String,
    position:String,
    officeLocation:String,
    salary:Number
})

module.exports = mongoose.model('Employee',empSchema);