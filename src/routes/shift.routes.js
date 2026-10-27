'use strict';

const { Router } = require('express');
const controller = require('../controllers/shift.controller');
const rules = require('../validators/shift.validator');
const validate = require('../middlewares/validate');
const requireUser = require('../middlewares/require-user');

const router = Router();

// Lahat ng shift management endpoints ay para lang sa HOST at ADMIN
router.use(requireUser('HOST', 'ADMIN'));

router.get('/', controller.list);
router.post('/', rules.createRules, validate, controller.create);
router.get('/:id', rules.idParam, validate, controller.get);
router.patch('/:id', rules.updateRules, validate, controller.update);
router.delete('/:id', rules.idParam, validate, controller.remove);

module.exports = router;