var express = require('express');
var sqlite3 = require('sqlite3');
var router = express.Router();
var db = new sqlite3.Database("splashes.db");

function getSplashContent(id, after) {
	var query = 'SELECT content FROM splashes ORDER BY id DESC LIMIT 1;';
	if (typeof id === 'number') {
		query = 'SELECT content FROM splashes WHERE id=\''+id+'\' LIMIT 1;';
	}
	
	db.all(query, function(err, content){
		if(!err) after(content);
	});
}

/* GET home page. */
router.get('/', function(req, res, next) {
	getSplashContent(null, function(content){
		res.render('splash', {preload: content});
	});
});

/* Retrieve splash content */
router.get('/splashcontent', function(req, res, next) {
	getSplashContent(null, function(content){
		res.send(content);
	});
});

module.exports = router;
