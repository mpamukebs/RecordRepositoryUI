'use strict';

var async = require('async');

// controllers
var home = require('./controllers/home'),
	usermanager = require('./controllers/usermanager'),
	feed = require('./controllers/feed');

// exposed routes
module.exports = function (app) {

  // app.get('/', home.home);

	app.get('/', function (req, res) {
		res.render('index.jade');
	});
	app.get('/getstarted', function (req, res) {
		res.render('getstarted.jade');

	});
  app.get('/logout', function (req, res) {
		app.locals.loggedin = false;
		res.redirect("/");
	});
	app.get('/login', function (req, res) {
		res.render('login.jade');
	});
	app.post('/auth', usermanager.auth);



};
