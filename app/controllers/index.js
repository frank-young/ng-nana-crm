//首页
exports.index = function(req, res) {
    var user = req.session.user,             //session信息			
        domain = req.subdomains

    if(!user){                              // 未登录状态
      	return res.redirect('/signin')
    }else if(!user.domain){                 //未添加域名状态
      	return res.redirect('/domain/add')
    }else{                                  //程序主入口
	    /* 需要判断用户输入的二级域名和用户保存的二级域名是否一致*/
	    // if(domain == user.domain){
	        res.sendfile('./app.html')
	    // }else{
	    //     console.log('账户信息不匹配,域名是'+domain)
	    //     return res.redirect('http://'+user.domain+'.nanacrm.com')
	    // }
    }
}