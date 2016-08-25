var mongoose = require('mongoose')	
var BusinessSchema = require('../../schemas/customer/business')
var Business = mongoose.model('Business',BusinessSchema)

module.exports = Business 
