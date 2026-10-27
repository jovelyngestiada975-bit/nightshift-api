'use strict';

const { Shift } = require('../models');

function findAll() {
  return Shift.findAll({ order: [['shift_id', 'ASC']] });
}

function findAllByHost(hostId) {
  return Shift.findAll({
    where: { host_id: hostId },
    order: [['shift_id', 'ASC']],
  });
}

function findById(id) {
  return Shift.findByPk(id);
}

function create(data) {
  return Shift.create(data);
}

function update(shift, changes) {
  return shift.update(changes);
}

function remove(shift) {
  return shift.destroy();
}

module.exports = {
  findAll,
  findAllByHost,
  findById,
  create,
  update,
  remove,
};