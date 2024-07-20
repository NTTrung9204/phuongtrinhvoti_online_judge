const express = require('express');
const router = express.Router();
const upload = require('../app/middleware/upload')
const userController = require('../app/controllers/userController');
console.log(process.cwd(), __dirname)
router.get('/:id', userController.index);
router.get('/:id/submission/:page', userController.submission);
router.post('/:id', upload.any(), userController.changeAvatar);


module.exports = router;
