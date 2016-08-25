var Index = require('../app/controllers/index'),
    User = require('../app/controllers/user'),
    Domain = require('../app/controllers/domain'),
    Customer = require('../app/controllers/customer/customer'),
    Clue = require('../app/controllers/customer/clue'),
    Business = require('../app/controllers/customer/business'),
    Group = require('../app/controllers/customer/group'),
    Tag = require('../app/controllers/customer/tag')

module.exports = function(app){
	app.use(function(req, res, next) {
    var _user = req.session.user
    app.locals.user = _user
    next()
  })
  app.get('/', function(req, res) {
    var user = req.session.user
    if(!user){
      return res.redirect('/signin')
    }else{
      res.sendfile('./frontend/src/index.html');
    }
    
});
	// app.get('/', Index.index)
  // 用户信息
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/signin', User.signinUnRequired, User.showSignin)
  app.get('/register', User.signinUnRequired, User.showSignup)
  app.get('/logout', User.logout)
  app.get('/success', User.signSuccess)
  app.get('/admin/user/list', User.signinRequired,User.adminRequired, User.list)

  // 域名信息设置
  app.get('/domain/addshow',User.signinRequired,Domain.domainRequired, Domain.addshow )
  app.post('/domain/add',User.signinRequired,Domain.domainRequired, Domain.add )


  // 客户
  app.get('/customer', Customer.list)
  app.post('/customer/update', Customer.update)
  app.post('/customer/add', Customer.save)
  app.delete('/customer/delete', Customer.del)
  app.get('/customer/detial/:id', Customer.detail)

  //潜在客户
  app.get('/clue', Clue.list)
  app.post('/clue/update', Clue.update)
  app.post('/clue/add', Clue.save)
  app.delete('/clue/delete', Clue.del)
  app.get('/clue/detial/:id', Clue.detail)

  //项目
  app.get('/business', Business.list)
  app.post('/business/update', Business.update)
  app.post('/business/add', Business.save)
  app.delete('/business/delete', Business.del)
  app.get('/business/detial/:id', Business.detail)

  //设置-group
  app.get('/group', Group.list)
  app.post('/group/update', Group.update)
  app.post('/group/add', Group.save)
  app.delete('/group/delete', Group.del)

  //设置-tag
  app.get('/tag', Tag.list)
  app.post('/tag/update', Tag.update)
  app.post('/tag/add', Tag.save)
  app.delete('/tag/delete', Tag.del)

  // app.get('/admin/customer/update/:id',User.adminRequired,Customer.update)
  // app.post('/admin/customer', User.adminRequired,Customer.save)
  // app.get('/admin/customer/list',User.adminRequired,Customer.list)
  // app.delete('/admin/customer/list',User.adminRequired,Customer.del)
}
