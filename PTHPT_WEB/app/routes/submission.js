const express = require('express');
const router = express.Router();
const submissionController = require('../app/controllers/submissionController');

router.get('/:page', submissionController.index);
router.get('/', submissionController.index);

module.exports = router;
