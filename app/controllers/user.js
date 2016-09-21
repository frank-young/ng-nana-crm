var User = require('../models/user')	//引入模型
	
	exports.showSignup = function(req, res) {
	  	res.render('signup', {
	  	  	title: '注册页面'
	  	})
	}

	exports.showSignin = function(req, res) {
	  	res.render('signin', {
	    	title: '登录页面'
	  	})
	}
	//注册
	exports.signup = function(req,res){

		var _user = req.body.user
		_user.role = 10
		var rePhone = /^1[3|5|7|8]\d{9}$/
		var reEmail=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
		var rePassword = /^[\w\@\.\_]+$/

		//验证
		if(_user.email == ""){
			res.json({
				status:0,
				msg:"邮箱不能为空！"
			})
		}else if(reEmail.test(_user.email) == false){
			res.json({
				status:0,
				msg:"邮箱格式不正确！"
			})
		}else if(_user.phone == ""){
			res.json({
				status:0,
				msg:"手机号不能为空！"
			})
		}else if(rePhone.test(_user.phone) == false){
			res.json({
				status:0,
				msg:"手机号格式不正确！"
			})
		}
		else if(_user.name == ""){
			res.json({
				status:0,
				msg:"姓名不能为空！"
			})
		}else if(_user.password == ""){
			res.json({
				status:0,
				msg:"手机号能为空！"
			})
		}else if(rePassword.test(_user.password)==false){
			res.json({
				status:0,
				msg:"密码格式不正确，必须为字母、数字、下划线！"
			})
		}else if(_user.password.length<6){
			res.json({
				status:0,
				msg:"密码长度必须大于6位，小于20位！"
			})
		}else if(_user.password.length>20){
			res.json({
				status:0,
				msg:"密码长度必须大于6位，小于20位！"
			})
		}else{
			User.findOne({email:_user.email},function(err,user){
				if(err){
					res.json({
						status:0,
						msg:"发生未知错误！"
					})
				}
				if(user){
					res.json({
						status:0,
						msg:"邮箱已经被注册！"
					})
				}else{
					var user = new User(_user)
					user.save(function(err,user){
						if(err){
							res.json({
								status:0,
								msg:"发生未知错误！"
							})
						}
						res.json({
							status:1,
							msg:"注册成功！"
						})
					})
				}
			})
		}

		
	}

	exports.signSuccess = function(req,res){
		res.render('success', {
	    	title: '注册成功'
	  	})
	}

	//登录
	exports.signin = function(req,res){
		var _user = req.body.user,
		 	email = _user.email,
		 	password = _user.password,
		 	verify = _user.luotest_response
 		var reEmail=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
 		var rePassword = /^[\w\@\.\_]+$/

		console.log(verify)

		if(_user.email == ""){
			res.json({
				status:0,
				msg:"邮箱不能为空！"
			})
		}else if(reEmail.test(email) == false){
			res.json({
				status:0,
				msg:"邮箱格式不正确！"
			})
		}else if(rePassword.test(password)==false){
			res.json({
				status:0,
				msg:"密码格式不正确，必须为字母、数字、下划线！"
			})
		}else if(password.length<6){
			res.json({
				status:0,
				msg:"密码长度必须大于6位，小于20位！"
			})
		}else if(password.length>20){
			res.json({
				status:0,
				msg:"密码长度必须大于6位，小于20位！"
			})
		}else{
			User.findOne({email: email},function(err,user){
				if(err){
					res.json({
						status:0,
						msg:"发生未知错误！"
					})
				}
				if(!user){
					res.json({
						status:0,
						msg:"用户不存在！"
					})
				}
				user.comparePassword(password,function(err,isMatch){
					if(err){
						res.json({
							status:0,
							msg:"发生未知错误！"
						})
					}
					if(isMatch){
						req.session.user = user
						res.json({
							status:1,
							msg:"登录成功！"
						})
					}else{
						res.json({
							status:0,
							msg:"账号或密码错误！"
						})
					}
				})
			})
		}
		
	}
	//登出
	exports.logout = function(req,res){
		delete req.session.user
		// delete app.locals.user
		res.redirect('/signin')
	}

	//userlist page
	exports.list = function(req,res){
		User.fetch(function(err,users){
			if(err){
				console.log(err)
			}
			res.render('userlist',{
				title:'用户列表',
				users:users
			})
		})
	}

	//登录权限
	exports.signinRequired = function(req,res,next){
		var user = req.session.user
		if(!user){
			return res.redirect('/signin')
		}
		next()
	}
	//未登录登录权限 （登录注册页）
	exports.signinUnRequired = function(req,res,next){
		var user = req.session.user
		if(user){
			return res.redirect('/#/index')
		}
		next()
	}
	//管理员权限
	exports.adminRequired = function(req,res,next){
		var user = req.session.user
		if(user.role <= 10 ){
			return res.redirect('/signin')
		}
		next()
	}