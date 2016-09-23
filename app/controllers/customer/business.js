var Business = require('../../models/customer/business')	//引入模型
var _ = require('underscore')
	
	//项目列表页
	exports.list = function(req,res){
		var user = req.session.user
		Business.fetch({"userlocal":user.email},function(err,businesss){
			if(err){
				res.json({
					msg:err
				})
				console.log(err)
			}else{
				res.json({
					businesss:businesss
				})
			}
			
		})
	}
	//项目更新、新建
	exports.save = function(req,res){
		var businessObj = req.body.business 	//从路由传过来的 business对象
		var user = req.session.user
		var _business
		if(!businessObj.bname){
			res.json({msg:"项目名不能为空",status: 0})
		}else if(!businessObj.people){
			res.json({msg:"负责人不能为空",status: 0})
		}else{
			_business = new Business({
				isTop: businessObj.isTop,
				isChecked: businessObj.isChecked,
				company: businessObj.company,
				bname:businessObj.bname,
				origins: businessObj.origins,
				status:businessObj.status,
				mobile:businessObj.mobile,
				email:businessObj.email,
				class:businessObj.class,
				amount:businessObj.amount,
				remark:businessObj.remark,
				isEdit:businessObj.isEdit,
				people:businessObj.people,
				schedule: businessObj.schedule,
				schedule_expired: businessObj.schedule_expired,
				schedule_complete: businessObj.schedule_complete,
				business: businessObj.business,
				userlocal:user.email,
				domainlocal:user.domain
			})
			_business.save(function(err,business){
				if(err){
					res.json({msg:"添加失败！",status: 0})
					console.log(err)
				}else{
					res.json({msg:"添加成功！",status: 1})

				}
			})
		}
			
	}
	//项目更新、新建
	exports.update = function(req,res){
		var id = req.body.business._id
		var businessObj = req.body.business 	//从路由传过来的 business对象
		var _business
		if(!businessObj.bname){
			res.json({msg:"项目名不能为空",status: 0})
		}else if(!businessObj.people){
			res.json({msg:"负责人不能为空",status: 0})
		}else{
			if(id !=="undefined"){
				Business.findById(id,function(err,business){
					if(err){
						console.log(err)
					}
					_business = _.extend(business,businessObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
					_business.save(function(err,business){
						if(err){
							res.json({msg:"更新失败！",status: 0})
							console.log(err)
						}else{
							res.json({msg:"更新成功！",status: 1})

						}

					})
				})
			}
		}
		
		
	}
	//项目详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Business.findById(id,function(err,business){
			res.json({
				business:business
			})
		})
	}
	//删除项目
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Business.remove({_id: id},function(err,business){
				if(err){
					console.log(err)
					res.json({msg:"更新失败！",status: 0})
				}else{
					res.json({msg:"更新成功！",status: 1})

				}
			})
		}
	}


	