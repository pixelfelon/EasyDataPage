var express = require('express');
var sqlite3 = require('sqlite3');
var router = express.Router();

/* GET input page. */
router.get('/', function(req, res, next) {
	res.render('content', {});
});

module.exports = router;
