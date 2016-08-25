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
			userObj = req.session.user,
			_user

		userObj.domain = _domain.name 		//更新域名

		Domain.findOne({name:_domain.name},function(err,domain){
			if(domain){
				res.json({status:"添加失败"})		//添加失败
			}else{

				var domain = new Domain(_domain)
				domain.save(function(err,domain){

					User.findOne({email:userObj.email},function(err,user){
						// if(!user.domain){
							
							_user = _.extend(user,userObj)	
							_user.save(function(err,user){

								res.redirect("/")	//添加成功

							})
						// }else{
						// 	res.json({status:"您已经注册了个性域名",domain: user.domain})

						// }
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
			res.redirect("/")
			return 
		}
		next()
	}
