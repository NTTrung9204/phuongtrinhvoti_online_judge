const express = require('express');
const router = express.Router();
const memberController = require('../app/controllers/memberController');

router.get('/', memberController.index);
router.get('/:page', memberController.index);

module.exports = router;
