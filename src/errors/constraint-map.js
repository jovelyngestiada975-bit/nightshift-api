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
  users_school_id_key: {
    status: 409,
    code: 'SCHOOL_ID_TAKEN',
    message: 'An account with that school ID already exists.',
  },
  users_email_key: {
    status: 409,
    code: 'EMAIL_TAKEN',
    message: 'An account with that email address already exists.',
  },
};