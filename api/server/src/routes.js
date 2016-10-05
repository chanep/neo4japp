'use strict'
const express = require('express');
const router = express.Router();
const roles = require('./models/roles');
const sessionController = new (require('./controllers/session'));
const security = new (require('./controllers/security'));
const skillController = new (require('./controllers/skill'));
const userController = new (require('./controllers/user'));
const approverController = new (require('./controllers/approver'));
const resourceManagerController = new (require('./controllers/resource-manager'));
const searchAllController = new (require('./controllers/search-all'));
const interestController = new (require('./controllers/interest'));
const officeController = new (require('./controllers/office'));


// ---------
// All Users
// ---------
router.post('/session/', sessionController.login.bind(sessionController));
router.delete('/session/', sessionController.logout.bind(sessionController));
router.get('/session/check', sessionController.check.bind(sessionController));

router.use(security.checkLoggedIn.bind(security));

router.get('/skill', skillController.find.bind(skillController));
router.get('/skill/all-groups', skillController.findAllGroups.bind(skillController));

router.get('/interest', interestController.find.bind(interestController));

router.get('/office', officeController.find.bind(officeController));

router.get('/user/details', userController.details.bind(userController));
router.get('/user/:userId/details', userController.details.bind(userController));
router.get('/user/all-skills', userController.fullSkillTreeWithUserKnowledges.bind(userController));
router.put('/user/knowledge', userController.setKnowledge.bind(userController));
router.put('/user/interest', userController.addInterest.bind(userController));
router.delete('/user/interest', userController.removeInterest.bind(userController));

// ---------
// Approvers
// ---------
router.use('/approver', security.checkRole(roles.approver).bind(security));

router.get('/approver/my-team', approverController.findMyTeamUsers.bind(approverController));
router.put('/approver/approve', approverController.approveKnowledge.bind(approverController));
router.get('/approver/search-all', searchAllController.searchAll.bind(searchAllController));

// -----------------
// Resource Managers
// -----------------
router.use('/resource-manager', security.checkRole(roles.resourceManager).bind(security));
router.get('/resource-manager/search-all', searchAllController.searchAll.bind(searchAllController));
router.get('/resource-manager/users-by-skill', resourceManagerController.findUsersBySkill.bind(resourceManagerController));
router.get('/resource-manager/top-skill-searches', resourceManagerController.topSkillSearches.bind(resourceManagerController));


module.exports = router;