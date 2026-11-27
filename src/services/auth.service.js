'use strict';

const userRepository = require('../repositories/user.repository');
const password = require('../security/password');
const token = require('../security/token');
const env = require('../config/env');
const { unauthorized } = require('../errors/app-error');

async function register({ school_id, full_name, email, password: plainPassword }) {
  const passwordHash = await password.hash(plainPassword);
  return userRepository.create({
    school_id,
    full_name,
    email,
    password_hash: passwordHash,
    role: 'PLAYER',
  });
}

async function login({ school_id, password: plainPassword }) {
  const user = await userRepository.findForLogin(school_id);
  const ok = await password.matches(plainPassword, user ? user.password_hash : null);
  if (!ok) {
    throw unauthorized('Invalid school ID or password.', 'INVALID_CREDENTIALS');
  }

  const accessToken = token.issue(user);
  return {
    token: accessToken,
    token_type: 'Bearer',
    expires_in: env.jwt.expiresIn,
    user,
  };
}

async function getMe(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw unauthorized();
  }
  return user;
}

module.exports = { register, login, getMe };