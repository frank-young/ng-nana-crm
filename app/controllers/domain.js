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
  		var re = /^[A-Za-z0-9]+$/

  		if(_domain.name==""){
  			res.json({
				status:0,
				msg:"个性域名不能为空！"
			})
  		}else if(_domain.name=="www"||_domain.name=="WWW"){
  			res.json({
				status:0,
				msg:"个性域名不能为www噢！"
			})
  		}else if(re.test(_domain.name)==false){
  			res.json({
				status:0,
				msg:"个性域名格式不正确，必须为字母或数字！"
			})
  		}else if(_domain.name.length<3){
  			res.json({
				status:0,
				msg:"个性域名长度必须大于3个字符，小于10个字符！"
			})
  		}else if(_domain.name.length>15){
  			res.json({
				status:0,
				msg:"个性域名长度必须大于3个字符，小于15个字符！"
			})
  		}else{
  			Domain.findOne({name:_domain.name},function(err,domain){
				if(err){
					res.json({
						status:0,
						msg:"发生未知错误！"
					})
				}
				if(domain){
					res.json({
						status:0,
						msg:"个性域名已经存在！"
					})	
				}else{
					var domain = new Domain(_domain)
					domain.save(function(err,domain){
						User.update({_id:userObj._id},
							{$set:{domain:_domain.name}},function(err){
								if(err){
									res.json({
										status:0,
										msg:"发生未知错误！"
									})
								}
								req.session.user.domain = _domain.name 		//更新session,添加domain来模拟存在
								res.json({
									status:1,
									msg:"添加成功！"
								})
							})
					})
				}
			})
  		}


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
