var Schedule = require('../../models/customer/schedule')	//引入模型
var _ = require('underscore')
	
	//日程列表页
	exports.list = function(req,res){
		var user = req.session.user
		Schedule.fetch({"userlocal":user.email},function(err,schedules){
			if(err){
				res.json({
					msg:err
				})
			}else{
				var date = new Date()

				var arr = []
				schedules.forEach(function(value,index){
					if(value.from <= date.getTime()){	
						arr.push(value)
					}
				})

				res.json({
					schedules:arr
				})
				
			}
		})
	}
	//日程扇写入
	exports.save = function(req,res){
		var scheduleObj = req.body.schedule 	//从路由传过来的 schedule对象
		var user = req.session.user
		var _schedule
			_schedule = new Schedule({

				people: scheduleObj.selectPeople,
				from: scheduleObj.fromDate,
				until: scheduleObj.untilDate,
				remind: scheduleObj.remind.date,
				content: scheduleObj.content,
				userlocal:user.email,
				domainlocal:user.domain

			})
			_schedule.save(function(err,schedule){
				if(err){
					console.log(err)
				}
				res.json({msg:"添加成功",status: 1})
			})
			
	}
	//日程更新
	exports.update = function(req,res){
		var id = req.body.schedule._id
		var scheduleObj = req.body.schedule 	//从路由传过来的 schedule对象
		var _schedule

		if(!scheduleObj.label){
			res.json({msg:"日程名称不能为空",status: 0})
		}else{
			if(id !=="undefined"){
				Schedule.findById(id,function(err,schedule){
					if(err){
						console.log(err)
					}
					_schedule = _.extend(schedule,scheduleObj)
					_schedule.save(function(err,schedule){
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

	//删除日程
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Schedule.remove({_id: id},function(err,schedule){
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

	//日程详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Schedule.findById(id,function(err,schedule){
			res.json({
				schedule:schedule
			})
		})
	}


	