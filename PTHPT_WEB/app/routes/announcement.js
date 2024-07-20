const express = require('express');
const router = express.Router();
const upload = require('../app/middleware/upload')
const AnnouncementController = require('../app/controllers/AnnouncementController');

router.get('/:_id', AnnouncementController.index);
router.post('/delete/:_id/:cmt_id/:cmtChild_id', AnnouncementController.delete);
router.post('/like/:_id/:cmt_id/:cmtChild_id', AnnouncementController.like);
router.post('/:_id', upload.single('myImage'), AnnouncementController.comment);

module.exports = router;
