var express = require('express');
var sqlite3 = require('sqlite3');
var router = express.Router();
var db = new sqlite3.Database("splashes.db");

/* GET input page. */
router.get('/', function(req, res, next) {
	res.render('actions', {});
});

/* Compute data and return result. */
router.post('/compute', function(req, res) {
	console.log("Good");
	res.send("Wow");
});

/* Set splash screen. */
router.post('/splash', function(req, res) {
	var stmt = db.prepare('INSERT INTO splashes (content) VALUES ((?));');
	stmt.run(req.content);
	stmt.finalize();
	
	res.send();
});

module.exports = router;
