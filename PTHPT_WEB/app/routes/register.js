const express = require('express');
const router = express.Router();
const RegisterController = require('../app/controllers/RegisterController');

router.get('/', RegisterController.index);
router.get('/check', RegisterController.check);
router.post('/check', RegisterController.checkPasscode);
router.post('/', RegisterController.register);

module.exports = router;
