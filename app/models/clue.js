var mongoose = require('mongoose')	
var ClueSchema = require('../schemas/clue')
var Clue = mongoose.model('Clue',ClueSchema)

module.exports = Clue 
