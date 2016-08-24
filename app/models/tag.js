var mongoose = require('mongoose')	
var TagSchema = require('../schemas/tag')
var Tag = mongoose.model('Tag',TagSchema)

module.exports = Tag 
