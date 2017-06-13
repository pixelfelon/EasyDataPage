var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("feelings.db");
db.serialize(function(){
	db.run("CREATE TABLE IF NOT EXISTS station (id INTEGER, name VARCHAR(60), token VARCHAR(60));");
	db.run("CREATE TABLE IF NOT EXISTS feels (station INTEGER, feeling INTEGER );");
});

var index = require('./routes/index');
var buttons = require('./routes/buttons');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/buttons', buttons);

app.post('/button', function(req, res){
	if(!(req.body.token && req.body.station && req.body.feel)){
		res.send({error: 'malformed request'})
		return;
	}
	
	var station_stmt = db.prepare('SELECT * FROM station WHERE name=(?);');
	station_stmt.get(req.body.station, function(err, data){
		station_stmt.finalize();
		
		if(!data){
			res.send({error: 'invalid station'});
			return;
		}
		if (data.token != req.body.token) {
			res.send({error: 'invalid token'});
			return;
		}
		
		var feel = parseInt(req.body.feel);
		var feel_stmt = db.prepare('INSERT INTO feels (station, feeling) VALUES ((?), (?));');
		feel_stmt.run(data.id, feel);
		feel_stmt.finalize();
		
		console.log("got feeling #"+feel);
		res.send({success: true, feel: feel});
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
