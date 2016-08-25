var mongoose = require('mongoose')	
var CustomerSchema = require('../../schemas/customer/customer')
var Customer = mongoose.model('Customer',CustomerSchema)

module.exports = Customer 
