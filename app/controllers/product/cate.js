var Cate = require('../../models/product/cate')	//引入模型
var _ = require('underscore')
	
	//分类列表页
	exports.list = function(req,res){
		Cate.fetch(function(err,cates){
			res.json({
				success:"1",
				cates:cates
			})
		})
	}
	//分类更新、新建
	exports.save = function(req,res){
		var cateObj = req.body.cate 	//从路由传过来的 cate对象
		var _cate
			_cate = new Cate({
				isEdit: cateObj.isEdit,
				value:cateObj.value,
				label:cateObj.label
			})
			_cate.save(function(err,cate){
				if(err){
					console.log(err)
				}
				res.json({status:"添加成功",success: 1})
			})
	}
	//分类更新、新建
	exports.update = function(req,res){
		var id = req.body.cate._id
		var cateObj = req.body.cate 	//从路由传过来的 cate对象
		var _cate
		if(id !=="undefined"){
			Cate.findById(id,function(err,cate){
				if(err){
					console.log(err)
				}
				_cate = _.extend(cate,cateObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_cate.save(function(err,cate){
					if(err){
						console.log(err)
					}

					res.json({status:"更新成功",success: 1})
				})
			})
		}
		
	}

	//删除分类
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Cate.remove({_id: id},function(err,cate){
				if(err){
					console.log(err)
				}else{
					res.json({success: 1})
				}
			})
		}
	}


	