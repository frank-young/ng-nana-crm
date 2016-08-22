var mongoose = require('mongoose')	
var CustomersetSchema = require('../schemas/customerset')
var Customerset = mongoose.model('Customerset',CustomersetSchema)

module.exports = Customerset 
