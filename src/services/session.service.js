'use strict';

const sessionRepository = require('../repositories/session.repository');
const shiftRepository = require('../repositories/shift.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', `No game session has the code ${code}.`);
  }
  return session;
}

const NEXT_STATUS = {
  LOBBY: ['RUNNING', 'CLOSED'],
  RUNNING: ['CLOSED'],
  CLOSED: [],
};

async function create(shiftId, user) {
  let shift = null;
  if (shiftId) {
    shift = await shiftRepository.findById(shiftId);
    if (!shift) {
      throw notFound('SHIFT_NOT_FOUND', `No shift has the id ${shiftId}.`);
    }
  }

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      return await sessionRepository.create({
        host_id: user.user_id,
        shift_id: shift ? shift.shift_id : null,
        join_pin: randomCode(),
        status: 'LOBBY',
        max_players: 10,
        current_position: 0,
      });
    } catch (error) {
      if (constraintOf(error) !== 'game_sessions_join_pin_key') throw error;
    }
  }
  throw new Error('Could not find a free join code after 5 attempts.');
}

async function changeStatus(code, status, user) {
  const session = await findOrFail(code);
  if (session.host_id !== user.user_id && user.role !== 'ADMIN') {
    throw forbidden('This game belongs to another host.');
  }

  if (!NEXT_STATUS[session.status].includes(status)) {
    throw conflict('INVALID_STATUS_CHANGE', `A ${session.status} game cannot become ${status}.`);
  }

  const changes = { status };
  if (status === 'RUNNING') changes.started_at = new Date();
  if (status === 'CLOSED') changes.ended_at = new Date();

  return sessionRepository.update(session, changes);
}

module.exports = {
  findOrFail,
  create,
  changeStatus,
};