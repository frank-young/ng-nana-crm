var Feedbackl = require('../models/feedbackl')	//引入模型
var _ = require('underscore')
	
	//意见反馈列表页
	exports.list = function(req,res){
		// var user = req.session.user
		Feedbackl.fetch(function(err,feedbackls){
			res.render('feedbackl', {
	    	title:"反馈意见",
	    	feedbackls:feedbackls
	  	})
		})
	}
	//意见反馈更新、新建
	exports.save = function(req,res){
		var feedbacklObj = req.body.feedbackl 	//从路由传过来的 Feedbackl对象
		var user = req.session.user
		var _feedbackl
			_feedbackl = new Feedbackl({
				content:feedbacklObj,
				user:user.email,
				name:user.name
			})
			_feedbackl.save(function(err,Feedbackl){
				if(err){
					console.log(err)
				}
				res.json({msg:"发送成功，我们将及时处理，以邮件的形式反馈给您",status: 1})
			})
	}
	//意见反馈更新、新建
	exports.update = function(req,res){
		var id = req.body.Feedbackl._id
		var feedbacklObj = req.body.feedbackl 	//从路由传过来的 Feedbackl对象
		var _feedbackl
		if(id !=="undefined"){
			Feedbackl.findById(id,function(err,Feedbackl){
				if(err){
					console.log(err)
				}
				_feedbackl = _.extend(Feedbackl,FeedbacklObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_feedbackl.save(function(err,Feedbackl){
					if(err){
						console.log(err)
					}

					res.json({msg:"更新成功",status: 1})
				})
			})
		}
		
	}

	//删除意见反馈
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Feedbackl.remove({_id: id},function(err,Feedbackl){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}


	