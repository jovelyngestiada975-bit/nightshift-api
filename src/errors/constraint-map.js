'use strict';

module.exports = {
  uq_player_nickname: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already used in this game.',
  },
  uq_player_session_user: {
    status: 409,
    code: 'ALREADY_IN_GAME',
    message: 'You already have a seat in this game.',
  },
};