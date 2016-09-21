var User = require('../models/user')	//引入模型
	
	//get user info 个人设置页面
	exports.data = function(req,res){
		var email = req.session.user.email
		if(email){
			User.findOne({email: email},function(err,user){
				res.json({
					user:user
				})
			})
		}
	}
	// update user
	exports.update = function(req,res){
		var email = req.session.user.email
		var user = req.body.setting
		if(email){
			User.update({email: email},
				{$set:{
						name:user.name,
						company:user.company,
						section:user.section,
						position:user.position,
						tel:user.tel,
						phone:user.phone,
						fax:user.fax,
						sex:user.sex,
						birthday:user.birthday,
						city:user.city
					}},function(err){
						if(err){
							res.json({
								status:"0",
								msg:"发生错误!",
								err:err
							})
						}else{
							res.json({
								status:"1",
								msg:"更新成功!"
							})
						}
					
			})
		}
	}
	exports.add = function(req,res){
		var _user = req.body.setting
		_user.domain = req.session.user.domain  	// 加入域名，相当于给予他房间钥匙
		_user.role = 0 		//  设置权限

		User.findOne({email:_user.email},function(err,user){
			if(err){
				res.json({
					status:"0",
					msg:"发生错误!",
					err:err
				})
			}
			if(user){
				res.json({status:"0",msg:"成员已经存在了!"})
			}else{
				var user = new User(_user)
				user.save(function(err,user){
					if(err){
						res.json({status:"0",msg:"发生错误!"})
					}else {
						res.json({status:"1",msg:"成员保存成功!"})
					}
				})
			}
		})
	}
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			User.remove({_id: id},function(err,quotation){
				if(err){
					res.json({
						status:"0",
						msg:"发生错误!",
						err:err
					})
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成员成功!"})
				}
			})
		}
	}

	/* 成员列表 */
	exports.list = function(req,res){
		var user = req.session.user
		User.fetch({'domain':user.domain},function(err,users){
			res.json({
				status:"1",
				users:users
			})
		})
	}

	/* 成员详情 */
	exports.detail = function(req,res){
		var id = req.params.id

		User.findById(id,function(err,user){
			if(err){
				res.json({
					status:"0",
					msg:"发生错误!",
					err:err
				})
			}else{
				res.json({
					user:user
				})
			}
			
		})
	}
	/* 成员更新 */
	exports.updatecopy = function(req,res){
		var setting = req.body.setting
		if(setting.email){
			User.update({email: setting.email},
				{$set:{
						name:setting.name,
						company:setting.company,
						section:setting.section,
						position:setting.position,
						tel:setting.tel,
						fax:setting.fax,
						sex:setting.sex,
						birthday:setting.birthday,
						city:setting.city
					}},function(err){
						if(err){
							res.json({
								status:"0",
								msg:"发生错误!",
								err:err
							})
							console.log(err)
						}else{
							res.json({
								status:"1",
								msg:"更新成功!"
							})
						}
						
			})
		}
	}
	//权限值
	exports.rbac = function(req,res){
		var user = req.session.user
		if(user){
			res.json({rbac:user.role}) 
		}else{
			res.json({rbac:0})
		}
	}

	//空间管理员权限
	exports.placeAdminRequired = function(req,res,next){
		var user = req.session.user
		if(user.role < 10 ){
			return res.json({status: 1,msg:"你没有权限访问"})
		}
		next()
	}

	







