'use strict';

const { body, param } = require('express-validator');

// Hub Contract rule 5: Anim na numero (6 digits) at hindi nagsisimula sa 0
const codeParam = param('code')
  .matches(/^[1-9][0-9]{5}$/)
  .withMessage('the join code must be six digits');

const createRules = [
  body('shift_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('shift_id must be a positive whole number')
    .toInt(),
];

const statusRules = [
  codeParam,
  body('status')
    .isIn(['RUNNING', 'CLOSED'])
    .withMessage('status must be RUNNING or CLOSED'),
];

const joinRules = [
  codeParam,
  body('nickname')
    .exists()
    .withMessage('nickname is required')
    .bail()
    .isString()
    .withMessage('nickname must be text')
    .bail()
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage('nickname must be 2 to 24 characters long'),
];

module.exports = {
  codeParam,
  createRules,
  statusRules,
  joinRules,
};