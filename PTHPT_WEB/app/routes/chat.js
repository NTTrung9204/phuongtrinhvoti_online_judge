const express = require('express');
const router = express.Router();
const chatController = require('../app/controllers/chatController');
const SocketService = require('../app/middleware/SocketService')

router.get('/', chatController.index);

module.exports = router;