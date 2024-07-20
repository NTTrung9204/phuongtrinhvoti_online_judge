const express = require('express');
const router = express.Router();
const sendMailController = require('../app/controllers/sendMailController');

router.get('/', sendMailController.sendMail);

module.exports = router;
