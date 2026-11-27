'use strict';

const { matchedData } = require('express-validator');
const authService = require('../services/auth.service');

function toJson(user) {
  return {
    user_id: user.user_id,
    school_id: user.school_id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
}

async function register(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const user = await authService.register(data);
  res.status(201).json({ user: toJson(user) });
}

async function login(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const result = await authService.login(data);
  res.status(200).json({
    token: result.token,
    token_type: result.token_type,
    expires_in: result.expires_in,
    user: toJson(result.user),
  });
}

async function me(req, res) {
  res.status(200).json({ user: toJson(req.account) });
}

module.exports = { toJson, register, login, me };