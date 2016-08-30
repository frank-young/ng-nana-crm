var User = require('../models/user')	//引入模型
	
	//get user info 
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
		console.log(user)
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
					res.json({
						status:"success"
					})
			})
		}
	}










