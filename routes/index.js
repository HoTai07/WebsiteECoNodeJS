var express = require('express');
var router = express.Router();

/*product page. */
router.use('/brand',require('./brands'));
router.use('/product',require('./products'));

module.exports = router;
