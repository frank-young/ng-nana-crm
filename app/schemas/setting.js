var mongoose = require('mongoose')	
var SettingSchema = new mongoose.Schema({
	isTop: Boolean,
	isChecked: Boolean,
	name: String,
	model:String,
	cate: String,
	people:String,
	editpeople:String,
	description:String,
	path:String,
	img:String,
	size:String,
	quantity:String,
	weight:String,
	meta:{
		createAt:{
			type:Number,
			default:Date.now()
		},
		updateAt:{
			type:Number,	
			default:Date.now()
		}
	}
})

SettingSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})

SettingSchema.statics = {
	fetch:function(cb){	
		return this
			.find({})
			.sort('meta.createAt')
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = SettingSchema