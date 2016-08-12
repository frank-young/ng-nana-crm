var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Customer = require('../app/controllers/customer')
var Clue = require('../app/controllers/clue')
var Business = require('../app/controllers/business')

module.exports = function(app){
	app.use(function(req, res, next) {
    var _user = req.session.user
    app.locals.user = _user
    next()
  })
  app.get('/', function(req, res) {
    res.sendfile('./frontend/src/index.html');
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

  // app.get('/admin/customer/update/:id',User.adminRequired,Customer.update)
  // app.post('/admin/customer', User.adminRequired,Customer.save)
  // app.get('/admin/customer/list',User.adminRequired,Customer.list)
  // app.delete('/admin/customer/list',User.adminRequired,Customer.del)
}
