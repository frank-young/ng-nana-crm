var Product = require('../../models/product/product')	//引入模型
var _ = require('underscore')
	
	//产品列表页
	exports.list = function(req,res){
		var user = req.session.user
		Product.fetch({"userlocal":user.email},function(err,products){
			res.json({
				products:products
			})
		})
	}
	//产品更新、新建
	exports.save = function(req,res){
		var productObj = req.body.product 	//从路由传过来的 product对象
		var user = req.session.user
		var _product
			_product = new Product({
				isTop: productObj.isTop,
				isChecked: productObj.isChecked,
				name: productObj.name,
				model: productObj.model,
				cate: productObj.cate,
				people: user.name,
				editpeople: user.name,
				description: productObj.description,
				path: productObj.path,
				img: productObj.img,
				userlocal:user.email,
				domainlocal:user.domain
			})
			_product.save(function(err,product){
				if(err){
					console.log(err)
				}
				res.json({msg:"添加成功",status: 1})
			})
	}
	//产品更新、新建
	exports.update = function(req,res){
		var id = req.body.product._id
		var productObj = req.body.product 	//从路由传过来的 product对象
		var user = req.session.user
		var _product
		productObj.editpeople = user.name
		if(id !=="undefined"){
			Product.findById(id,function(err,product){

				_product = _.extend(product,productObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_product.save(function(err,product){
					if(err){
						console.log(err)
					}

					res.json({msg:"更新成功",status: 1})
				})
			})
		}
	}
	//产品详情页
	exports.detail = function(req,res){
		var id = req.params.id		//拿到id的值
		Product.findById(id,function(err,product){
			res.json({
				product:product
			})
		})
	}
	//删除产品
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Product.remove({_id: id},function(err,product){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}

