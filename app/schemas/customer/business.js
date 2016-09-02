var mongoose = require('mongoose')	
var BusinessSchema = new mongoose.Schema({
	isTop: Boolean,
	isChecked: Boolean,
	company: String,
	bname:String,
	origins: String,
	status:String,
	mobile:String,
	email:String,
	class:String,
	amount:String,
	remark:String,
	isEdit:String,
	people:String,
	schedule:Array,
	schedule_expired:Array,
	schedule_complete:Array,
	business:Array,
	meta:{
		createAt:{
			type:Number,	//类型
			default:Date.now()	//默认值
		},
		updateAt:{
			type:Number,	
			default:Date.now()
		}
	},
	userlocal:String,
	domainlocal:String
})

BusinessSchema.pre('save',function(next){	//每次存数据之前都要调用这个方法
	if(this.isNew){
		//数据是否是新加的，创建的时间和更新时间设置为当前时间
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})

BusinessSchema.statics = {
	fetch:function(rule,cb){		//取出目前数据库所有的数据
		return this
			.find(rule)	//查找全部数据
			.sort('meta.createAt')		//按照更新时间排序
			.exec(cb)
	},
	findById:function(id,cb){		//取出目前数据库所有的数据
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = BusinessSchema