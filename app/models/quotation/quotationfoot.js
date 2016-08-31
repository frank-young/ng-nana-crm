var mongoose = require('mongoose')	
var QuotationfootSchema = require('../../schemas/quotation/quotationfoot')
var Quotationfoot = mongoose.model('Quotationfoot',QuotationfootSchema)

module.exports = Quotationfoot 
