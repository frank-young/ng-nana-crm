var User = require('../models/user')	//引入模型
var uuid = require('node-uuid')
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')

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
	exports.forgot = function(req, res) {
	  	res.render('forgot', {
	    	title: '忘记密码'
	  	})
	}
	exports.successSend = function(req, res) {
		var email = req.session.emailforgot
	  	res.render('successsend', {
	    	title: '发送邮箱成功',
	    	email:email
	  	})
	}
	exports.resetpassword = function(req, res) {
		var verify = req.params.verify
	  	res.render('reset', {
	    	title: '重置密码',
	    	verify:verify
	  	})
	}
	exports.successpassword = function(req, res) {
	  	res.render('successpassword', {
	    	title: '重置密码成功'
	  	})
	}
	exports.savepassword = function(req, res) {
		var _user = req.body.user
		console.log(_user)
		var rePassword = /^[\w\@\.\_]+$/
		if(_user.password == ""){
			res.json({
				status:0,
				msg:"密码不能为空！"
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
			User.findOne({verify:_user.verify},function(err,user){
				user.password = _user.password
				user.save(function(err,user){
					if(err){
						res.json({
							status:0,
							msg:" 发生未知错误！"
						})
					}
					res.json({
						status:1,
						msg:"重置密码成功！"
					})
				})
			})
		}
	}

	exports.forgotSend = function(req, res) {
		var _user = req.body.user
		var reEmail=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
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
		}else{
			User.findOne({email:_user.email},function(err,user){
				if(!user){
					res.json({
						status:0,
						msg:"邮箱不存在！"
					})
				}else{
					var transporter = nodemailer.createTransport(smtpTransport({
					    host: "smtp.qq.com",
					    port: 465,
					    secure: true,
					    auth: {
					        user: "frankyoung@nanafly.com",
					        pass: "yfgdwkehkfcgbdcf"
					    }
					}))
					var host = 'http://60.205.157.200'
					var mailOptions = {
					    from: '呐呐科技<frankyoung@nanafly.com>', 
					    to: user.email, 
					    subject: '呐呐CRM客户系统重置密码', 
						html:'<table width="100%" cellpadding="0" border="0" cellspacing="0" style="background: #43434d"><tbody><tr><td width="100%" style="padding-top:38px; padding-bottom: 35px; text-align: center "><a href="https://nanacrm.com/" style="text-decoration: none;color:#fff;font-size:20px;" target="_blank">呐呐科技CRM客户关系管理系统</a></td></tr><tr><td align="center"><table width="602" cellspacing="0" border="0" cellpadding="0" style="background: #fff;"><tbody><tr><td style="border-bottom: 1px solid #d2d2d2 ; padding:46px 0 36px; color:#000;font-size: 18px; text-align: center;;">忘记密码</td></tr><tr><td style="padding:30px 52px 50px; border-bottom:1px solid #d2d2d2"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tbody><tr><td style="font-size: 14px; margin-bottom:20px; text-align:left; padding-bottom:30px;"> 尊敬的&nbsp; '+user.name+'：</td></tr><tr><td style="color:#666; font-size: 14px; line-height: 24px; padding: 0 0 40px;"> 恭喜！您的呐呐CRM帐户“ <strong>'+user.email+'</strong> ”需要重置密码。<br> 现在，点击下面的按钮来重置密码！</td></tr><tr><td style="text-align: center; padding:0 50%"><a href="'+host+'/resetpassword/'+user.verify+'" style="padding:15px 0; width:220px; margin-left:-110px; display:block; background:#5D9CEC ;color:#fff; font-size: 14px; border-radius: 3px; text-decoration: none;" target="_blank"> 立即重置</a></td></tr></tbody></table></td></tr><tr><td style="padding:30px;text-align: left; font-size: 12px; line-height: 24px;"><table cellpadding="0" border="0" cellspacing="0"><tbody><tr style="text-align: left"><td style="color:#333;"> 在线客服</td></tr><tr><td style="color:#666 "> QQ &nbsp;<span style="border-bottom:1px dashed #ccc;z-index:1" t="7" onclick="return false;" data="742643619">742643619</span> &nbsp; ( 使用咨询 ) &nbsp; QQ &nbsp;<span style="border-bottom:1px dashed #ccc;z-index:1" t="7" onclick="return false;" data="631084625">631084625</span>&nbsp; ( 技术支持 )</td></tr><tr><td style="color:#333;">客服热线</td></tr><tr><td style="color:#666"><span style="border-bottom:1px dashed #ccc;z-index:1" t="7" onclick="return false;" data="15620616890">15620616890</span> &nbsp;( 使用咨询 )</td></tr><tr><td style="color:#333;">支持邮箱</td></tr><tr><td style="color:#666;"><a href="mailto:frankyoung@nanafly.com" style="text-decoration: none; color:#666;" target="_blank">frankyoung@nanafly.com</a></td></tr><tr><td style="padding-top: 30px; color:#333; font-size: 14px; line-height: 24px;">顺祝您生活愉快！</td></tr><tr><td style="line-height: 24px; font-size: 14px; color:#333;">nana 团队敬上</td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style="padding:45px 0 79px; font-size: 14px; line-height: 24px; color:#fff; text-align: center">nanacrm.com © 2016</td></tr></tbody></table>'
					}
					transporter.sendMail(mailOptions, function(error, info){
					    if(error){
					        return console.log(error)
					    }

					    req.session.emailforgot = _user.email
					    res.json({
							status:1,
							msg:"发送成功，请查收邮件。"
						})
					})
				}
			})
		}
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
				msg:"密码不能为空！"
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
			User.findOne({phone:_user.phone},function(err,user){
				if(user){
					res.json({
						status:0,
						msg:"手机号已经被注册！"
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

							_user.verify = uuid.v4() //添加激活 token
							var user = new User(_user)

							user.save(function(err,user){
								if(err){
									res.json({
										status:0,
										msg:"发生未知错误！"
									})
								}
								// 发送邮件验证
								var transporter = nodemailer.createTransport(smtpTransport({
								    host: "smtp.qq.com",
								    port: 465,
								    secure: true,
								    auth: {
								        user: "frankyoung@nanafly.com",
								        pass: "yfgdwkehkfcgbdcf"
								    }
								}))
								var host = 'http://60.205.157.200'
								var mailOptions = {
								    from: '呐呐科技<frankyoung@nanafly.com>', // sender address 
								    to: _user.email, // list of receivers 
								    subject: '呐呐CRM客户系统注册', // Subject line 
								    // text: 'Hello world ✔', // plaintext body 
								    html:'<table width="100%" cellpadding="0" border="0" cellspacing="0" style="background: #43434d"><tbody><tr><td width="100%" style="padding-top:38px; padding-bottom: 35px; text-align: center "><a href="https://nanacrm.com/" style="text-decoration: none;color:#fff;font-size:20px;" target="_blank">呐呐科技CRM客户关系管理系统</a></td></tr><tr><td align="center"><table width="602" cellspacing="0" border="0" cellpadding="0" style="background: #fff;"><tbody><tr><td style="border-bottom: 1px solid #d2d2d2 ; padding:46px 0 36px; color:#000;font-size: 18px; text-align: center;;">恭喜您已注册成功</td></tr><tr><td style="padding:30px 52px 50px; border-bottom:1px solid #d2d2d2"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tbody><tr><td style="font-size: 14px; margin-bottom:20px; text-align:left; padding-bottom:30px;"> 尊敬的&nbsp; '+_user.name+'：</td></tr><tr><td style="color:#666; font-size: 14px; line-height: 24px; padding: 0 0 40px;"> 恭喜！您的呐呐CRM帐户“ <strong>'+_user.email+'</strong> ”已成功创建。<br> 现在，点击下面的按钮来激活您的账号！</td></tr><tr><td style="text-align: center; padding:0 50%"><a href="'+host+'/activation/'+_user.verify+'" style="padding:15px 0; width:220px; margin-left:-110px; display:block; background:#5D9CEC ;color:#fff; font-size: 14px; border-radius: 3px; text-decoration: none;" target="_blank"> 立即激活</a></td></tr></tbody></table></td></tr><tr><td style="padding:30px;text-align: left; font-size: 12px; line-height: 24px;"><table cellpadding="0" border="0" cellspacing="0"><tbody><tr style="text-align: left"><td style="color:#333;"> 在线客服</td></tr><tr><td style="color:#666 "> QQ &nbsp;<span style="border-bottom:1px dashed #ccc;z-index:1" t="7" onclick="return false;" data="742643619">742643619</span> &nbsp; ( 使用咨询 ) &nbsp; QQ &nbsp;<span style="border-bottom:1px dashed #ccc;z-index:1" t="7" onclick="return false;" data="631084625">631084625</span>&nbsp; ( 技术支持 )</td></tr><tr><td style="color:#333;">客服热线</td></tr><tr><td style="color:#666"><span style="border-bottom:1px dashed #ccc;z-index:1" t="7" onclick="return false;" data="15620616890">15620616890</span> &nbsp;( 使用咨询 )</td></tr><tr><td style="color:#333;">支持邮箱</td></tr><tr><td style="color:#666;"><a href="mailto:frankyoung@nanafly.com" style="text-decoration: none; color:#666;" target="_blank">frankyoung@nanafly.com</a></td></tr><tr><td style="padding-top: 30px; color:#333; font-size: 14px; line-height: 24px;">顺祝您生活愉快！</td></tr><tr><td style="line-height: 24px; font-size: 14px; color:#333;">nana 团队敬上</td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style="padding:45px 0 79px; font-size: 14px; line-height: 24px; color:#fff; text-align: center">nanacrm.com © 2016</td></tr></tbody></table>'
								}

								transporter.sendMail(mailOptions, function(error, info){
								    if(error){
								        return console.log(error)
								    }
								 
								})

								req.session.emailVerify = _user.email
								res.json({
									status:1,
									msg:"注册成功！"
								})
							})
						}
					})
				}
			})
			
		}

		
	}

	exports.signVerify = function(req,res){
		var email = req.session.emailVerify
		res.render('verify', {
	    	title: '验证邮箱',
	    	email:email
	  	})
	}

	exports.signSuccess = function(req,res){
		res.render('success', {
	    	title: '激活成功'
	  	})
	}

	exports.signActivation = function(req,res){
		var verify = req.params.verify
		if(verify){
			User.update({verify: verify},
				{$set:{
						status:1,
					}},function(err){
						if(err){
							res.json({
								status:0,
								msg:"发生未知错误!"
							})
						}else{
							console.log('激活成功')
							delete req.session.emailVerify
							res.redirect('/success')
						}	
						
			})
		}
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
		}else if(password == ""){
			res.json({
				status:0,
				msg:"密码不能为空！"
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
				if(user.status == 1){
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
				}else{
					res.json({
						status:2,
						msg:"您需要激活您的账户！"
					})
				}
				
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