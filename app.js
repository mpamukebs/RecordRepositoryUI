var express = require('express');
// var index = require('./routes/index');
var routes = require('./app/routes');
var http = require('http');
var path = require('path');


app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// property file instead

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('wXp7,8FXENc%>9n'));
app.use(express.cookieSession());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// bootstrap routes.
routes(app);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

exports = module.exports = server;
