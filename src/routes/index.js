'use strict';

const { Router } = require('express');
const currentUser = require('../middlewares/current-user');

const router = Router();

// Public / Hub Contract endpoints
router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));
router.use('/results', require('./results.routes'));

// From here on, req.user is set via X-Demo-User header
router.use(currentUser);

// Game Modules
router.use('/shifts', require('./shift.routes'));

module.exports = router;