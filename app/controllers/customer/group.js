var Group = require('../../models/customer/group')	//引入模型
var _ = require('underscore')
	
	//分组列表页
	exports.list = function(req,res){
		Group.fetch(function(err,groups){
			res.json({
				success:"1",
				groups:groups
			})
		})
	}
	//分组更新、新建
	exports.save = function(req,res){
		var groupObj = req.body.group 	//从路由传过来的 group对象
		var _group
			_group = new Group({
				isEdit: groupObj.isEdit,
				value:groupObj.value,
				label:groupObj.label

			})
			_group.save(function(err,group){
				if(err){
					console.log(err)
				}
				res.json({status:"添加成功",success: 1})
			})
	}
	//分组更新、新建
	exports.update = function(req,res){
		var id = req.body.group._id
		var groupObj = req.body.group 	//从路由传过来的 group对象
		var _group
		if(id !=="undefined"){
			Group.findById(id,function(err,group){
				if(err){
					console.log(err)
				}
				_group = _.extend(group,groupObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_group.save(function(err,group){
					if(err){
						console.log(err)
					}

					res.json({status:"更新成功",success: 1})
				})
			})
		}
		
	}

	//删除分组
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Group.remove({_id: id},function(err,group){
				if(err){
					console.log(err)
				}else{
					res.json({success: 1})
				}
			})
		}
	}


	