'use strict';

const { matchedData } = require('express-validator');
const sessionService = require('../services/session.service');

function toJson(session) {
  return {
    code: session.join_pin,
    status: session.status,
    max_players: session.max_players,
    current_position: session.current_position,
    started_at: session.started_at,
    ended_at: session.ended_at,
  };
}

async function create(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const session = await sessionService.create(data.shift_id, req.user);
  res.status(201).json(toJson(session));
}

async function get(req, res) {
  const { code } = matchedData(req);
  const session = await sessionService.findOrFail(code);
  res.status(200).json(toJson(session));
}

async function changeStatus(req, res) {
  const { code, status } = matchedData(req);
  const session = await sessionService.changeStatus(code, status, req.user);
  res.status(200).json(toJson(session));
}

module.exports = {
  create,
  get,
  changeStatus,
};