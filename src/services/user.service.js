'use strict';

const userRepository = require('../repositories/user.repository');
const { notFound, conflict } = require('../errors/app-error');

function list() {
  return userRepository.findAll();
}

async function changeRole(targetUserId, role, caller) {
  if (targetUserId === caller.user_id) {
    throw conflict('CANNOT_CHANGE_OWN_ROLE', 'Admins cannot change their own role.');
  }

  const user = await userRepository.findById(targetUserId);
  if (!user) {
    throw notFound('USER_NOT_FOUND', `No user has the id ${targetUserId}.`);
  }

  return userRepository.update(user, { role });
}

module.exports = { list, changeRole };