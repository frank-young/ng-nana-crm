var mongoose = require('mongoose')	
var BusinessSchema = require('../schemas/business')
var Business = mongoose.model('Business',BusinessSchema)

module.exports = Business 
