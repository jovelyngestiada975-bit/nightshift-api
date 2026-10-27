'use strict';

const { Op } = require('sequelize');
const { Player, GameSession } = require('../models');

function findSeat(sessionId, userId) {
  return Player.findOne({ where: { session_id: sessionId, user_id: userId } });
}

function countBySession(sessionId) {
  return Player.count({ where: { session_id: sessionId } });
}

function markSeen(player) {
  return player.update({ last_seen_at: new Date() });
}

function findRunningSeatElsewhere(userId, sessionId) {
  return Player.findOne({
    where: {
      user_id: userId,
      session_id: { [Op.ne]: sessionId },
    },
    include: [
      {
        model: GameSession,
        where: { status: 'RUNNING' },
        attributes: ['join_pin'],
      },
    ],
  });
}

function findAllBySession(sessionId) {
  return Player.findAll({
    where: { session_id: sessionId },
    order: [['score', 'DESC'], ['nickname', 'ASC']],
  });
}

function create(data) {
  return Player.create(data);
}

module.exports = {
  findSeat,
  countBySession,
  markSeen,
  findRunningSeatElsewhere,
  findAllBySession,
  create,
};