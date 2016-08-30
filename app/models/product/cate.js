var mongoose = require('mongoose')	
var CateSchema = require('../../schemas/product/cate')
var Cate = mongoose.model('Cate',CateSchema)

module.exports = Cate 
