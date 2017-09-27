var express = require('express');
var sqlite3 = require('sqlite3');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('splash', {});
});

module.exports = router;
