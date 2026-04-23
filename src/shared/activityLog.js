const crypto = require('crypto');
const { pool } = require('../config/db');

async function logActivity({ userId, action, entityType, entityId, description }) {
  const id = crypto.randomUUID();
  try {
    await pool.query(
      `INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, userId, action, entityType, entityId, description]
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

module.exports = {
  logActivity
};
