var mongoose = require('mongoose')	
var QuotationSchema = require('../../schemas/quotation/quotation')
var Quotation = mongoose.model('Quotation',QuotationSchema)

module.exports = Quotation 
