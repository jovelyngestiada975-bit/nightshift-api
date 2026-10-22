'use strict';

const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  let query = `
    SELECT 
      '731594' AS session_code,
      gs.start_time AS started_at,
      COALESCE(gs.end_time, gs.start_time + INTERVAL '6 minutes') AS ended_at,
      u.school_id,
      u.full_name AS nickname,
      COALESCE(sc.total_survival_time, 360) AS score,
      (gs.result IN ('survived', 'jumpscared')) AS completed
    FROM game_sessions gs
    JOIN users u ON u.user_id = gs.user_id
    LEFT JOIN scores sc ON sc.user_id = u.user_id
    WHERE gs.result IN ('survived', 'jumpscared')
  `;

  if (since) {
    query += ` AND COALESCE(gs.end_time, gs.start_time + INTERVAL '6 minutes') > :since`;
  }

  query += ` ORDER BY gs.start_time ASC`;

  const [rows] = await sequelize.query(query, {
    replacements: { since: since ? new Date(since).toISOString() : null },
  });

  return rows;
}

module.exports = { findFinishedGamePlayers };