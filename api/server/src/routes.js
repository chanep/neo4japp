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
const clientController = new (require('./controllers/client'));
const officeController = new (require('./controllers/office'));
const taskController = new (require('./controllers/task'));
const config = require('./shared/config');

//------------------
// External Services
//------------------
router.get('/external-service/user/summary', security.checkAccessKey(config.serviceAccessKey), userController.findUserSummary.bind(userController));
router.get('/external-service/skill', security.checkAccessKey(config.serviceAccessKey), skillController.find.bind(skillController));
router.get('/external-service/skill/all-groups', security.checkAccessKey(config.serviceAccessKey), skillController.findAllGroups.bind(skillController));
router.get('/external-service/skill/by-group-type/:type', security.checkAccessKey(config.serviceAccessKey), skillController.findByType.bind(skillController));
router.get('/external-service/approver/:approverUsername/myTeam', security.checkAccessKey(config.serviceAccessKey), approverController.findDirectReports.bind(approverController));
router.get('/external-service/resource-managers', security.checkAccessKey(config.serviceAccessKey), resourceManagerController.allResourceManagers.bind(resourceManagerController));

// ---------
// All Users
// ---------
router.post('/session/', sessionController.login.bind(sessionController));
router.delete('/session/', sessionController.logout.bind(sessionController));
router.get('/session/check', sessionController.check.bind(sessionController));

router.use(security.checkLoggedIn.bind(security));

router.get('/skill', skillController.find.bind(skillController));
router.get('/skill/all-groups', skillController.findAllGroups.bind(skillController));
router.get('/skill/by-group-type/:type', skillController.findByType.bind(skillController));

router.get('/interest', interestController.find.bind(interestController));

router.get('/client', clientController.find.bind(clientController));

router.get('/office', officeController.find.bind(officeController));

router.get('/user/details', userController.details.bind(userController));
router.get('/user/:userId/details', userController.details.bind(userController));
router.get('/user/:userId/similar-skilled-users', userController.findUsersWithSimilarSkills.bind(userController));
router.get('/user/:userId/skills', userController.findUserSkills.bind(userController));
router.get('/user/level', security.checkRole([roles.resourceManager, roles.searcher]).bind(security), userController.findAllEmployeeLevels.bind(userController));
router.put('/user/knowledge', userController.setKnowledge.bind(userController));
router.delete('/user/knowledge', userController.deleteKnowledge.bind(userController));
router.put('/user/interest', userController.addInterest.bind(userController));
router.delete('/user/interest', userController.removeInterest.bind(userController));
router.put('/user/client', userController.addClient.bind(userController));
router.delete('/user/client', userController.removeClient.bind(userController));
router.put('/user/skill-suggestion', userController.suggestSkill.bind(userController));

// ---------
// Approvers
// ---------
router.use('/approver', security.checkRole(roles.approver).bind(security));

router.get('/approver/my-team', approverController.findMyTeamUsers.bind(approverController));
router.get('/approver/:approverId/my-team', approverController.findMyTeamUsers.bind(approverController));
router.put('/approver/approve', approverController.approveKnowledge.bind(approverController));
router.get('/approver/search-all', searchAllController.searchAll.bind(searchAllController));
router.get('/approver/my-team', approverController.findMyTeamUsers.bind(approverController));
router.get('/approver/pending', approverController.findApproversWithPendingApprovals.bind(approverController));

// -----------------
// Resource Managers
// -----------------
router.use('/resource-manager', security.checkRole([roles.resourceManager, roles.searcher]).bind(security));
router.get('/resource-manager/my-resources', resourceManagerController.findMyResourceUsers.bind(resourceManagerController));
router.get('/resource-manager/search-all', searchAllController.searchAll.bind(searchAllController));
router.get('/resource-manager/users-by-skill', resourceManagerController.findUsersBySkill.bind(resourceManagerController));
router.get('/resource-manager/skill-by-user', resourceManagerController.findSkillByUser.bind(resourceManagerController));
router.get('/resource-manager/top-skill-searches', resourceManagerController.topSkillSearches.bind(resourceManagerController));
router.get('/resource-manager/skilled-users-by-office/:skillId', security.checkRole(roles.resourceManager), resourceManagerController.skilledUsersByOffice.bind(resourceManagerController));
router.put('/resource-manager/approval-request/:employeeId', resourceManagerController.requestApproval.bind(resourceManagerController));

// ------
// Admins
// ------
router.use('/admin', security.checkRole(roles.admin).bind(security));
router.get('/admin/task', taskController.status.bind(taskController));
router.post('/admin/task/:taskName', taskController.run.bind(taskController));

module.exports = router;
