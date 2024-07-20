const express = require('express');
const router = express.Router();
const upload = require('../app/middleware/upload')
const AssignmentController = require('../app/controllers/AssignmentController');

router.get('/', AssignmentController.index);
router.get('/:page', AssignmentController.index);
router.get('/view/:_id', AssignmentController.view);
router.post('/view/:_id', upload.any(), AssignmentController.submit);
router.get('/solution/:_id', AssignmentController.showSolution);

module.exports = router;
