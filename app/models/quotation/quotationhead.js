var mongoose = require('mongoose')	
var QuotationheadSchema = require('../../schemas/quotation/quotationhead')
var Quotationhead = mongoose.model('Quotationhead',QuotationheadSchema)

module.exports = Quotationhead 
