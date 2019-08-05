const express = require('express');
const router = express.Router();
const ctrl = require('./user.ctrl');
const loginRequired = require('../../middleware/loginRequired');
const rightUserCheck = require('../../middleware/rightUserCheck');

router.get('/:id', loginRequired, rightUserCheck, ctrl.get_index);


module.exports = router;
