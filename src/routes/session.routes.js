'use strict';

const { Router } = require('express');
const sessionController = require('../controllers/session.controller');
const playerController = require('../controllers/player.controller');
const rules = require('../validators/session.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');

const router = Router();

// Host endpoints para mag-start at magbago ng status ng game
router.post('/', requireUser('HOST', 'ADMIN'), rules.createRules, validate, sessionController.create);
router.get('/:code', rules.codeParam, validate, sessionController.get);
router.patch('/:code', requireUser('HOST', 'ADMIN'), rules.statusRules, validate, sessionController.changeStatus);

// Player endpoints (Sumasailalim sa /sessions/:code/players)
router.post('/:code/players', requireUser(), rules.joinRules, validate, playerController.join);
router.get('/:code/players', rules.codeParam, validate, playerController.list);

module.exports = router;