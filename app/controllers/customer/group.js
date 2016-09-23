var Group = require('../../models/customer/group')	//引入模型
var _ = require('underscore')
	
	//分组列表页
	exports.list = function(req,res){
		var user = req.session.user
		Group.fetch({"userlocal":user.email},function(err,groups){
			if(err){
				res.json({
					msg:err
				})
			}else{
				res.json({
					groups:groups
				})
			}
			

		})
	}
	//分组更新、新建
	exports.save = function(req,res){
		var groupObj = req.body.group 	//从路由传过来的 group对象
		var user = req.session.user
		var _group
			_group = new Group({
				isEdit: groupObj.isEdit,
				value:groupObj.value,
				label:groupObj.label,
				userlocal:user.email,
				domainlocal:user.domain

			})
			_group.save(function(err,group){
				if(err){
					console.log(err)
				}
				res.json({msg:"添加成功",status: 1})
			})
			
	}
	//分组更新、新建
	exports.update = function(req,res){
		var id = req.body.group._id
		var groupObj = req.body.group 	//从路由传过来的 group对象
		var _group

		if(!groupObj.label){
			res.json({msg:"分组名称不能为空",status: 0})
		}else{
			if(id !=="undefined"){
				Group.findById(id,function(err,group){
					if(err){
						console.log(err)
					}
					_group = _.extend(group,groupObj)
					_group.save(function(err,group){
						if(err){
							console.log(err)
						}else{
							res.json({msg:"操作成功",status: 1})

						}

					})
					
				})
			}
		}		
	}

	//删除分组
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Group.remove({_id: id},function(err,group){
				if(err){
					res.json({
						msg:err
					})
					console.log(err)
				}else{
					res.json({status: 1,msg:'删除成功'})
				}
			})
		}
	}


	