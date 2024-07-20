const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/adminController');

router.get('/contest' , adminController.contest);
router.post('/contest/:_id/updateScore' , adminController.contestUpdateScore);
router.get('/contest/:_id/detail' , adminController.contestDetail);
router.post('/contest/:_id/detail' , adminController.contestDetailUpdateProblems);
router.get('/contest/:_id/participants' , adminController.contestParticipant);
router.get('/contest/:_id/participants/:username/ban' , adminController.contestParticipantBan);
router.get('/contest/:_id/participants/:username/detail' , adminController.contestParticipantDetail);
router.post('/contest/:_id/participants/:username/detail' , adminController.contestUpdateParticipant);
router.get('/contest/create' , adminController.contestCreate);
router.post('/contest/create' , adminController.contestCreateContest);

router.get('/coreteam' , adminController.coreteam);
router.get('/coreteam/create' , adminController.coreteamCreate);
router.post('/coreteam/create' , adminController.coreteamCreatePost);
router.get('/coreteam/:_id/detail' , adminController.coreteamDetail);
router.post('/coreteam/:_id/detail' , adminController.coreteamUpdate);
router.get('/coreteam/:_id/delete' , adminController.coreteamDelete);

router.get('/announcement' , adminController.Announcement);
router.get('/announcement/:_id/detail' , adminController.AnnouncementDetail);
router.post('/announcement/:_id/update' , adminController.AnnouncementUpdate);
router.get('/announcement/create' , adminController.AnnouncementCreate);
router.post('/announcement/create' , adminController.AnnouncementCreateForm);

router.get('/member' , adminController.Member);
router.get('/member/:_id/detail' , adminController.MemberDetail);
router.post('/member/:_id/update' , adminController.MemberUpdate);

router.get('/topListAssignment' , adminController.topListAssignment);
router.get('/topListAssignment/:_id/update' , adminController.topListAssignmentUpdate);
router.get('/topListAssignment/create' , adminController.topListAssignmentCreate);
router.post('/topListAssignment/create' , adminController.topListAssignmentCreateType);
router.post('/topListAssignment/:_id/update' , adminController.topListAssignmentUpdateType);

router.get('/topListAssignment/:Type/assignment' , adminController.typeAssignment);
router.get('/topListAssignment/:Type/assignment/:_id/detail' , adminController.typeAssignmentDetail);
router.post('/topListAssignment/:Type/assignment/:_id/update' , adminController.typeAssignmentUpdate);
router.get('/topListAssignment/:Type/assignment/create' , adminController.typeAssignmentCreate);
router.post('/topListAssignment/:Type/assignment/create' , adminController.typeAssignmentCreateForm);

router.get('/:id/edit' , adminController.editMember);
router.get('/:id/delete' , adminController.destroy);
router.post('/:id' , adminController.delete);
router.put('/:id' , adminController.update);
router.get('/', adminController.index);





module.exports = router;
