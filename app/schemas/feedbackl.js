var mongoose = require('mongoose')	
var FeedbacklSchema = new mongoose.Schema({
	content:String,
	user:String,
	name:String,
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

FeedbacklSchema.pre('save',function(next){	//每次存数据之前都要调用这个方法
	if(this.isNew){
		//数据是否是新加的，创建的时间和更新时间设置为当前时间
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})

FeedbacklSchema.statics = {
	fetch:function(rule,cb){		//取出目前数据库所有的数据
		return this
			.find(rule)	//查找全部数据
			.sort('value')		//按照更新时间排序
			.exec(cb)
	},
	findById:function(id,cb){		//取出目前数据库所有的数据
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = FeedbacklSchema
