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
		
		User.findOne({email:_user.email},function(err,user){
			if(err){
				console.log(err)
			}
			if(user){
				return res.redirect('/signin')
			}else{
				var user = new User(_user)
				user.save(function(err,user){
					if(err){
						console.log(err)
					}
					res.redirect("/success")
				})
			}
		})
	}

	exports.signSuccess = function(req,res){
		res.render('success', {
	    	title: '注册成功'
	  	})
	}

	//登录
	exports.signin = function(req,res){
		var _user = req.body.user
		var email = _user.email
		var password = _user.password

		User.findOne({email: email},function(err,user){
			if(err){
				console.log(err)
			}
			if(!user){
				return res.redirect('/register')
			}
			user.comparePassword(password,function(err,isMatch){
				if(err){
					console.log(err)
				}
				if(isMatch){
					console.log('登录成功')
					req.session.user = user
					return res.redirect('/success')

				}else{
					console.log('登录失败')
					return res.redirect('/signin')
				}
			})
		})
	}
	//登出
	exports.logout = function(req,res){
		delete req.session.user
		// delete app.locals.user
		res.redirect('/')
	}

	//userlist page
	exports.list = function(req,res){
		User.fetch(function(err,users){
			if(err){
				console.log(err)
			}
			// console.log(users)
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
			return res.redirect('/')
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