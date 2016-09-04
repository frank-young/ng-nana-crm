var Quotation = require('../../models/quotation/quotation')	//引入模型
var _ = require('underscore')
	
	//产品列表页
	exports.list = function(req,res){
		var user = req.session.user
		Quotation.fetch({"userlocal":user.email},function(err,quotations){
			res.json({
				success:"1",
				quotations:quotations
			})
		})
	}
	//产品更新、新建
	exports.save = function(req,res){
		var quotationObj = req.body.quotation 	//从路由传过来的 quotation对象
		var user = req.session.user
		var _quotation
			_quotation = new Quotation({
				isTop: quotationObj.isTop,
				isChecked: quotationObj.isChecked,
				name: quotationObj.name,
				company: quotationObj.company,
				amount: quotationObj.amount,
				phase: quotationObj.phase,
				people: user.name,
				units:quotationObj.units,
				head:quotationObj.head,
				foot:quotationObj.foot,
				products:quotationObj.products
			})
			_quotation.save(function(err,quotation){
				res.json({msg:"添加成功",success: 1})
			})
	}
	//产品更新、新建
	exports.update = function(req,res){
		var id = req.body.quotation._id
		var quotationObj = req.body.quotation 	//从路由传过来的 quotation对象
		var user = req.session.user
		var _quotation
		quotationObj.editpeople = user.name
		if(id !=="undefined"){
			Quotation.findById(id,function(err,quotation){
				_quotation = _.extend(quotation,quotationObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_quotation.save(function(err,quotation){
					if(err){
						console.log(err)
					}

					res.json({msg:"更新成功",success: 1})
				})
			})
		}
	}
	//产品详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Quotation.findById(id,function(err,quotation){
			res.json({
				quotation:quotation
			})
		})
	}
	//删除产品
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Quotation.remove({_id: id},function(err,quotation){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}

