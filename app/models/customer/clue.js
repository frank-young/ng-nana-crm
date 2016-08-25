var mongoose = require('mongoose')	
var ClueSchema = require('../../schemas/customer/clue')
var Clue = mongoose.model('Clue',ClueSchema)

module.exports = Clue 
