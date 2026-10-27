'use strict';

const { matchedData } = require('express-validator');
const shiftService = require('../services/shift.service');

// toJson: Ang pinapayagan lang na fields na makita ng client
function toJson(shift) {
  return {
    id: shift.shift_id,
    title: shift.title,
    difficulty: shift.difficulty,
    is_public: shift.is_public,
    host_id: shift.host_id,
    created_at: shift.created_at,
  };
}

async function list(req, res) {
  const shifts = await shiftService.list(req.user);
  res.status(200).json(shifts.map(toJson));
}

async function get(req, res) {
  const { id } = matchedData(req);
  const shift = await shiftService.get(id, req.user);
  res.status(200).json(toJson(shift));
}

async function create(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const shift = await shiftService.create(data, req.user);
  res.status(201).json(toJson(shift));
}

async function update(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const changes = matchedData(req, { locations: ['body'] });
  const shift = await shiftService.update(id, changes, req.user);
  res.status(200).json(toJson(shift));
}

async function remove(req, res) {
  const { id } = matchedData(req);
  await shiftService.remove(id, req.user);
  res.status(204).end();
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};