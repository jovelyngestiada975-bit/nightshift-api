'use strict';

const sessionService = require('./session.service');
const playerRepository = require('../repositories/player.repository');
const { conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

async function join(code, nickname, user) {
  const session = await sessionService.findOrFail(code);

  // 1. Rejoin check: Kung may seat na, ibalik ang parehong seat nang may status 200 (Slide 29)
  const seat = await playerRepository.findSeat(session.session_id, user.user_id);
  if (seat) {
    await playerRepository.markSeen(seat);
    return { session, player: seat, created: false };
  }

  // 2. Hub Contract v1.2: One game at a time (Slide 30)
  const elsewhere = await playerRepository.findRunningSeatElsewhere(user.user_id, session.session_id);
  if (elsewhere) {
    throw conflict('ALREADY_IN_GAME', 'You are still playing another game. Finish it first.');
  }

  // 3. New seat checks
  if (session.status === 'CLOSED') {
    throw conflict('SESSION_ENDED', 'This game has ended.');
  }
  if (session.status !== 'LOBBY') {
    throw conflict('SESSION_NOT_JOINABLE', 'This game has already started.');
  }

  const seatsTaken = await playerRepository.countBySession(session.session_id);
  if (seatsTaken >= session.max_players) {
    throw conflict('SESSION_FULL', 'This game is full.');
  }

  try {
    const player = await playerRepository.create({
      session_id: session.session_id,
      user_id: user.user_id,
      nickname,
      score: 0,
      last_seen_at: new Date(),
    });
    return { session, player, created: true };
  } catch (error) {
    if (constraintOf(error) === 'uq_player_session_user') {
      const existing = await playerRepository.findSeat(session.session_id, user.user_id);
      return { session, player: existing, created: false };
    }
    throw error;
  }
}

async function listBySession(code) {
  const session = await sessionService.findOrFail(code);
  return playerRepository.findAllBySession(session.session_id);
}

module.exports = {
  join,
  listBySession,
};