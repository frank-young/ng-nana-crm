var Customer = require('../../models/customer/customer')	//引入模型
var _ = require('underscore')
	
	//客户列表页
	exports.list = function(req,res){
		var user = req.session.user
		Customer.fetch({"userlocal":user.email},function(err,customers){
			
			if(err){
				res.json({
					msg:err
				})
				console.log(err)
			}else{
				res.json({
					customers:customers
				})
			}
			
		})
	}
	//客户更新、新建
	exports.save = function(req,res){
		var customerObj = req.body.customer 	//从路由传过来的 customer对象
		var user = req.session.user
		var _customer
		if(!clueObj.companyName){
			res.json({msg:"公司名不能为空",status: 0})
		}else{
			_customer = new Customer({
				isTop: customerObj.isTop,
				isChecked: customerObj.isChecked,
				website: customerObj.website,
				companyName: customerObj.companyName,
				name: customerObj.name,
				progress: customerObj. progress,
				tags: customerObj.tags,
				star: customerObj.star,
				group: customerObj.group,
				origin: customerObj.origin,
				mobile: customerObj.mobile,
				fax: customerObj.fax,
				class: customerObj.class,
				st: customerObj.st,
				remark: customerObj.remark,
				peoples: customerObj.peoples,
				position: customerObj.position,
				email: customerObj.email,
				country: customerObj.country,
				address: customerObj.address,
				schedule: customerObj.schedule,
				schedule_expired: customerObj.schedule_expired,
				schedule_complete: customerObj.schedule_complete,
				business: customerObj.business,
				charge:user.name,
				userlocal:user.email,
				domainlocal:user.domain
			})
			_customer.save(function(err,customer){
				if(err){
					res.json({
						msg:err
					})
					console.log(err)
				}
				res.json({msg:"添加成功",status: 1})
			})
		}
			
	}
	//客户更新
	exports.update = function(req,res){
		var id = req.body.customer._id
		var customerObj = req.body.customer 	//从路由传过来的 customer对象
		var _customer
		if(id !=="undefined"){
			Customer.findById(id,function(err,customer){

				_customer = _.extend(customer,customerObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_customer.save(function(err,customer){
					if(err){
						res.json({msg:err})
					}else{
						res.json({msg:"更新成功",status: 1})

					}
				})
			})
		}
		
	}
	//客户详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Customer.findById(id,function(err,customer){
			res.json({
				customer:customer
			})
		})
	}
	//删除客户
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Customer.remove({_id: id},function(err,customer){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1})
				}
			})
		}
	}

