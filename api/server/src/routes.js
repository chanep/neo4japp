'use strict'
const express = require('express');
const router = express.Router();
const sessionController = new (require('./controllers/session'));
const security = new (require('./controllers/security'));

router.post('/session/', sessionController.login.bind(sessionController));
router.delete('/session/', sessionController.logout.bind(sessionController));

router.use(security.checkLoggedIn.bind(security));

router.get('/test/', security.checkRole('mongorole').bind(security) , (req, res) =>{
  console.log("headers", req.headers);
  console.log('req.session.user', req.session.user)
  res.send('OK');
});

// mount user routes at /users
//router.use('/users', userRoutes);

module.exports = router;