var mongoose = require('mongoose')	
var ScheduleSchema = require('../../schemas/customer/schedule')
var Schedule = mongoose.model('Schedule',ScheduleSchema)

module.exports = Schedule 
