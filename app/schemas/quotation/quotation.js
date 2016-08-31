var mongoose = require('mongoose')	
var QuotationSchema = new mongoose.Schema({
	isTop: Boolean,
	isChecked: Boolean,
	name: String,
	company:String,
	amount: String,
	phase:String,
	people:String,
	units:String,
	head:String,
	foot:String,
	products:Array,
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

QuotationSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})

QuotationSchema.statics = {
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

module.exports = QuotationSchema