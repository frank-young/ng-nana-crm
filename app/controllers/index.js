var Customer = require('../models/customer/customer')	//引入模型

//首页
exports.index = function(req,res){
	// var _user = req.session.user
	// if(_user){
	// 	app.locals.user = _user
	// }
	Customer.fetch(function(err,customers){
		if(err){
			console.log(err)
		}
		res.render('index',{
			title:'My web',
			customers: customers
		})
	})
	// return res.redirect('/register')
	
}
