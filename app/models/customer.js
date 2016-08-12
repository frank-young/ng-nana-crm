var mongoose = require('mongoose')	
var CustomerSchema = require('../schemas/customer')
var Customer = mongoose.model('Customer',CustomerSchema)

module.exports = Customer 
