var Business = require('../../models/customer/business')	//引入模型
var _ = require('underscore')
	
	//项目列表页
	exports.list = function(req,res){
		Business.fetch(function(err,businesss){
			res.json({
				success:"1",
				businesss:businesss
			})
		})
	}
	//项目更新、新建
	exports.save = function(req,res){
		var businessObj = req.body.business 	//从路由传过来的 business对象
		var _business
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
				business: businessObj.business
			})
			_business.save(function(err,business){
				if(err){
					console.log(err)
				}
				res.json({status:"添加成功",success: 1})
			})
	}
	//项目更新、新建
	exports.update = function(req,res){
		var id = req.body.business._id
		var businessObj = req.body.business 	//从路由传过来的 business对象
		var _business
		if(id !=="undefined"){
			Business.findById(id,function(err,business){
				if(err){
					console.log(err)
				}
				_business = _.extend(business,businessObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_business.save(function(err,business){
					if(err){
						console.log(err)
					}

					res.json({status:"更新成功",success: 1})
				})
			})
		}
		
	}
	//项目详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Business.findById(id,function(err,business){
			res.json({
				title:'项目详情页',
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
				}else{
					res.json({success: 1})
				}
			})
		}
	}

	//admin page
	exports.new = function(req,res){
		res.render('admin',{
			title:'后台页面',
			business:{

			}
		})
	}

	