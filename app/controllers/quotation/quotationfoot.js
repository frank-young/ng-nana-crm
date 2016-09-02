var Quotationfoot = require('../../models/quotation/quotationfoot')	//引入模型
var _ = require('underscore')
	
	//产品列表页
	exports.list = function(req,res){

		Quotationfoot.fetch(function(err,quotationfoots){
			res.json({
				status:"1",
				quotationfoots:quotationfoots
			})
		})
	}
	//产品更新、新建
	exports.save = function(req,res){
		var quotationfootObj = req.body.quotationfoot 	//从路由传过来的 quotationfoot对象
		var _quotationfoot
			_quotationfoot = new Quotationfoot({
				value: quotationfootObj.value,
				text: quotationfootObj.text,
				isEdit: quotationfootObj.isEdit,
				content: quotationfootObj.content,

			})
			_quotationfoot.save(function(err,quotationfoot){
				res.json({status:"添加成功",status: 1})
			})
	}
	//产品更新、新建
	exports.update = function(req,res){
		var id = req.body.quotationfoot._id
		var quotationfootObj = req.body.quotationfoot 	//从路由传过来的 quotationfoot对象
		var _quotationfoot

		if(id !=="undefined"){
			Quotationfoot.findById(id,function(err,quotationfoot){
				_quotationfoot = _.extend(quotationfoot,quotationfootObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_quotationfoot.save(function(err,quotationfoot){
					if(err){
						console.log(err)
					}

					res.json({status:"更新成功",status: 1})
				})
			})
		}
	}
	//产品详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Quotationfoot.findById(id,function(err,quotationfoot){
			res.json({
				quotationfoot:quotationfoot
			})
		})
	}
	//删除产品
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Quotationfoot.remove({_id: id},function(err,quotationfoot){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1})
				}
			})
		}
	}

