'use strict';

const { matchedData } = require('express-validator');
const playerService = require('../services/player.service');

async function join(req, res) {
  const { code, nickname } = matchedData(req);
  const { session, player, created } = await playerService.join(code, nickname, req.user);

  // 201 Created kapag bagong seat, 200 OK kapag Rejoin (Slide 29)
  res.status(created ? 201 : 200).json({
    player_id: player.player_id,
    nickname: player.nickname,
    score: player.score,
    rejoined: !created,
    session: {
      code: session.join_pin,
      status: session.status,
      current_position: session.current_position,
    },
  });
}

async function list(req, res) {
  const { code } = matchedData(req);
  const players = await playerService.listBySession(code);
  res.status(200).json(
    players.map((p) => ({
      nickname: p.nickname,
      score: p.score,
    }))
  );
}

module.exports = {
  join,
  list,
};