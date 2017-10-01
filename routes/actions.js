var express = require('express');
var sqlite3 = require('sqlite3');
var factorial = require('factorial');
var router = express.Router();
var db = new sqlite3.Database("splashes.db");

/* GET input page. */
router.get('/', function(req, res, next) {
	res.render('actions', {});
});

/* Compute data and return result. */
router.post('/compute', function(req, res) {
	if (!(req.body.data && req.body.operation)) {
		res.status(400);
		res.send({error: 'malformed request'});
		return;
	}
	
	x = parseFloat(req.body.data);
	result = 0;
	switch (req.body.operation) {
		case "fac":
			result = factorial(x);
			break;
		case "ex":
			result = Math.pow(Math.E, x);
			break;
		case "sine":
			result = Math.sin(x);
			break;
		default:
			res.status(400);
			res.send({error: 'invalid operation'});
			return;
	}
	
	res.send({result: result});
});

/* Set splash screen. */
router.post('/splash', function(req, res) {
	if (typeof req.body.content !== 'string') {
		res.status(400);
		res.send({error: 'malformed request'});
		return;
	}
	
	var stmt = db.prepare('INSERT INTO splashes (content) VALUES ((?));');
	stmt.run(req.body.content);
	stmt.finalize();
	
	res.status(200);
	res.send();
});

module.exports = router;
