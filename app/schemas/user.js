var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
var SALT_WORK_FACTOR = 10
/**
 ** 	****角色权限*****
 * 	
 * 	0: 成员，空间管理者分配的子成员
 * 	1~9：空间的层级权限
 *	10: 注册用户，空间管理者
 *	11~19：模块升级权限
 *  20：高级用户 
 * 
 *	>50 作者，frankyoung，超级管理员
 *
 * 
 */
var UserSchema = new mongoose.Schema({
	name:String,
	phone:{
		unique:true,
		type:String
	},
	email:{
		unique:true,
		type:String
	},
	domain:String,
	password:String,
	role:Number,
	company:String,
	section:String,
	position:String,
	tel:String,
	fax:String,
	sex:String,
	birthday:{
		type:Number,
		default:0
	},
	city:String,
	class:String,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	},
	status:Number,
	verify:String
})

UserSchema.pre('save',function(next){	//每次存数据之前都要调用这个方法
	var user = this
	if(this.isNew){
		//数据是否是新加的，创建的时间和更新时间设置为当前时间
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
	    if (err) return next(err)

	    bcrypt.hash(user.password, salt, function(err, hash) {
	      if (err) return next(err)

	      user.password = hash
	      next()
	    })
	})
})

UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) return cb(err)

      cb(null, isMatch)
    })
  }
}

UserSchema.statics = {
	fetch:function(rule,cb){		//取出目前数据库所有的数据
		return this
			.find(rule)	//查找全部数据
			.sort('meta.updateAt')		//按照更新时间排序
			.exec(cb)
	},
	findById:function(id,cb){		//取出目前数据库所有的数据
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = UserSchema