var mongoose = require('mongoose')	
var GroupSchema = require('../../schemas/customer/group')
var Group = mongoose.model('Group',GroupSchema)

module.exports = Group 
