'use strict';

const shiftRepository = require('../repositories/shift.repository');
const { notFound, forbidden } = require('../errors/app-error');

async function findOrFail(id) {
  const shift = await shiftRepository.findById(id);
  if (!shift) {
    throw notFound('SHIFT_NOT_FOUND', `No shift has the id ${id}.`);
  }
  return shift;
}

function isOwner(shift, user) {
  return shift.host_id === user.user_id || user.role === 'ADMIN';
}

function list(user) {
  return user.role === 'ADMIN'
    ? shiftRepository.findAll()
    : shiftRepository.findAllByHost(user.user_id);
}

async function get(id, user) {
  const shift = await findOrFail(id);
  if (!isOwner(shift, user) && !shift.is_public) {
    throw forbidden('This shift belongs to another host.');
  }
  return shift;
}

function create(data, user) {
  return shiftRepository.create({ ...data, host_id: user.user_id });
}

async function update(id, changes, user) {
  const shift = await findOrFail(id);
  if (!isOwner(shift, user)) {
    throw forbidden('This shift belongs to another host.');
  }
  return shiftRepository.update(shift, changes);
}

async function remove(id, user) {
  const shift = await findOrFail(id);
  if (!isOwner(shift, user)) {
    throw forbidden('This shift belongs to another host.');
  }
  await shiftRepository.remove(shift);
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};