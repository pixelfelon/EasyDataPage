var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database("feelings.db");

function getFeels(db, after){
	db.all('SELECT id, name FROM station;', function(err, stations){
		var temp = {};
		for (var i = 0; i < stations.length; i++) {
			var station = stations[i];
			temp[station.id] = station.name;
		}
		stations = temp;
		
		db.all('SELECT * FROM feels;', function(err, feels){
			data = {};
			for (var station in stations) {
				data[stations[station]] = [];
			}
			
			for (var i = 0; i < feels.length; i++) {
				var feel = feels[i];
				var station = stations[feel.station];
				data[station].push(feel.feeling);
			}
			
			after(data);
		});
	});
}

/* GET home page. */
router.get('/', function(req, res, next) {
	getFeels(db, function(feels){
		db.all('SELECT id, name, label FROM station;', function(err, stations){
			res.render('graphs', { preload: feels, stations: stations });
		});
	});
});

module.exports = {router: router, getFeels: getFeels};
