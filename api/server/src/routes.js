'use strict'
const express = require('express');
const router = express.Router();
const sessionController = new (require('./controllers/session'));
const security = new (require('./controllers/security'));
const skillController = new (require('./controllers/skill'));
const userController = new (require('./controllers/user'));

router.post('/session/', sessionController.login.bind(sessionController));
router.delete('/session/', sessionController.logout.bind(sessionController));

router.use(security.checkLoggedIn.bind(security));

router.get('/skill', skillController.find.bind(skillController));
router.get('/skill/all-groups', skillController.findAllGroups.bind(skillController));

router.get('/user/details', userController.details.bind(userController));
router.put('/user/knowledge', userController.setKnowledge.bind(userController));


module.exports = router;