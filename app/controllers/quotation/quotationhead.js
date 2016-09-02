var Quotationhead = require('../../models/quotation/quotationhead')	//引入模型
var _ = require('underscore')
	
	//产品列表页
	exports.list = function(req,res){

		Quotationhead.fetch(function(err,quotationheads){
			res.json({
				status:"1",
				quotationheads:quotationheads
			})
		})
	}
	//产品更新、新建
	exports.save = function(req,res){
		var quotationheadObj = req.body.quotationhead 	//从路由传过来的 quotationhead对象
		var _quotationhead
			_quotationhead = new Quotationhead({
				value: quotationheadObj.value,
				isEdit: quotationheadObj.isEdit,
				text: quotationheadObj.text,
				company: quotationheadObj.company,
				cname: quotationheadObj.cname,
				address: quotationheadObj.address,
				phone: quotationheadObj.phone,
				email: quotationheadObj.email,
				people: quotationheadObj.people,
				mobile: quotationheadObj.mobile,
				fromDate: quotationheadObj.fromDate,
				untilDate: quotationheadObj.untilDate,
				logo: quotationheadObj.logo
			})
			_quotationhead.save(function(err,quotationhead){
				res.json({status:"添加成功",status: 1})
			})
	}
	//产品更新、新建
	exports.update = function(req,res){
		var id = req.body.quotationhead._id
		var quotationheadObj = req.body.quotationhead 	//从路由传过来的 quotationhead对象
		var _quotationhead

		if(id !=="undefined"){
			Quotationhead.findById(id,function(err,quotationhead){
				_quotationhead = _.extend(quotationhead,quotationheadObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_quotationhead.save(function(err,quotationhead){
					res.json({status:"更新成功",status: 1})
				})
			})
		}
	}
	//产品详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Quotationhead.findById(id,function(err,quotationhead){
			res.json({
				quotationhead:quotationhead
			})
		})
	}
	//删除产品
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Quotationhead.remove({_id: id},function(err,quotationhead){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1})
				}
			})
		}
	}

