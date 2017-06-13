var express = require('express');
var router = express.Router();

/* GET input page. */
router.get('/', function(req, res, next) {
  res.render('buttons', {});
});

module.exports = router;
