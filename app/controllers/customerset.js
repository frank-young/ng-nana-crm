var Customer = require('../models/customerset')	//引入模型
var _ = require('underscore')
	
	//客户列表页
	exports.list = function(req,res){
		Customer.fetch(function(err,customers){
			res.json({
				success:"1",
				customers:customers
			})
		})
	}
	//客户更新、新建
	exports.save = function(req,res){
		var customerObj = req.body.customer 	//从路由传过来的 customer对象
		var _customer
			_customer = new Customer({
				isEdit: customerObj.isEdit,
				value:customerObj.value,
				label:customerObj.label

			})
			_customer.save(function(err,customer){
				if(err){
					console.log(err)
				}
				res.json({status:"添加成功",success: 1})
			})
	}
	//客户更新、新建
	exports.update = function(req,res){
		var id = req.body.customer._id
		var customerObj = req.body.customer 	//从路由传过来的 customer对象
		var _customer
		if(id !=="undefined"){
			Customer.findById(id,function(err,customer){
				if(err){
					console.log(err)
				}
				_customer = _.extend(customer,customerObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_customer.save(function(err,customer){
					if(err){
						console.log(err)
					}

					res.json({status:"更新成功",success: 1})
				})
			})
		}
		
	}
	//客户详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Customer.findById(id,function(err,customer){
			res.json({
				title:'客户详情页',
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
					res.json({success: 1})
				}
			})
		}
	}

	//admin page
	exports.new = function(req,res){
		res.render('admin',{
			title:'后台页面',
			customer:{

			}
		})
	}

	