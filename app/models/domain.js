var mongoose = require('mongoose')	
var DomainSchema = require('../schemas/domain')
var Domain = mongoose.model('Domain',DomainSchema)

module.exports = Domain 
