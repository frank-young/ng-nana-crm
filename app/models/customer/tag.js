var mongoose = require('mongoose')	
var TagSchema = require('../../schemas/customer/tag')
var Tag = mongoose.model('Tag',TagSchema)

module.exports = Tag 
