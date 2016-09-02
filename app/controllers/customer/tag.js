var Tag = require('../../models/customer/tag')	//引入模型
var _ = require('underscore')
	
	//分组列表页
	exports.list = function(req,res){
		Tag.fetch(function(err,tags){
			res.json({
				status:"1",
				tags:tags
			})
		})
	}
	//分组更新、新建
	exports.save = function(req,res){
		var tagObj = req.body.tag 	//从路由传过来的 tag对象
		var _tag
			_tag = new Tag({
				isEdit: tagObj.isEdit,
				value:tagObj.value,
				text:tagObj.text,
				color:tagObj.color

			})
			_tag.save(function(err,tag){
				if(err){
					console.log(err)
				}
				res.json({status:"添加成功",status: 1})
			})
	}
	//分组更新、新建
	exports.update = function(req,res){
		var id = req.body.tag._id
		var tagObj = req.body.tag 	//从路由传过来的 tag对象
		var _tag
		if(id !=="undefined"){
			Tag.findById(id,function(err,tag){
				if(err){
					console.log(err)
				}
				_tag = _.extend(tag,tagObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_tag.save(function(err,tag){
					if(err){
						console.log(err)
					}

					res.json({status:"更新成功",status: 1})
				})
			})
		}
		
	}

	//删除分组
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Tag.remove({_id: id},function(err,tag){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1})
				}
			})
		}
	}


	