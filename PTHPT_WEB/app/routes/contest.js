const express = require('express');
const router = express.Router();
const contestController = require('../app/controllers/contestController');
const upload = require('../app/middleware/upload')

router.get('/', contestController.index);
router.get('/:_id', contestController.layout);
router.get('/:_id/:index', contestController.showSolution);
router.post('/submit/:_id', contestController.submit);

module.exports = router;