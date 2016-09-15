var mongoose = require('mongoose')	
var FeedbacklSchema = require('../schemas/feedbackl')
var Feedbackl = mongoose.model('Feedbackl',FeedbacklSchema)

module.exports = Feedbackl
