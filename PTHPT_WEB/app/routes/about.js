const express = require('express');
const router = express.Router();
const aboutController = require('../app/controllers/aboutController');

router.get('/', aboutController.index);

module.exports = router;
