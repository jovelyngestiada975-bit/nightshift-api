'use strict';

const { GameSession } = require('../models');

function findByCode(code) {
  return GameSession.findOne({ where: { join_pin: String(code) } });
}

function findById(id) {
  return GameSession.findByPk(id);
}

function create(data) {
  return GameSession.create(data);
}

function update(session, changes) {
  return session.update(changes);
}

module.exports = {
  findByCode,
  findById,
  create,
  update,
};