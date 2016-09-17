var Domain = require('../models/domain'),	//引入模型
	User = require('../models/user'),
	_ = require('underscore')

	exports.add = function(req, res) {
		res.render('domainadd', {
	  	  	title: '添加域名页面'
	  	})
	}

	//添加
	exports.addctrl = function(req,res){
		var _domain = req.body.domain,
			userObj = req.session.user

		Domain.findOne({name:_domain.name},function(err,domain){
			if(domain){
				res.json({msg:"添加失败"})		//添加失败
			}else{
				var domain = new Domain(_domain)
				domain.save(function(err,domain){
					User.update({_id:userObj._id},
						{$set:{domain:_domain.name}},function(err){
							req.session.user.domain = _domain.name 		//更新session,添加domain来模拟存在
							res.redirect("/#/index")
						})
				})
			}
		})
	}

	//域名权限
	exports.domainRequired = function(req,res,next){
		var userObj = req.session.user
		//判断是否有域名
		if(userObj.domain){
			res.redirect("/#/index")
			return 
		}
		next()
	}
