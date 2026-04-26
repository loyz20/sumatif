const crypto = require('crypto');
const { pool } = require('../config/db');

async function logActivity({ user_id, action, entity_type, entity_id, description }) {
  try {
    const id = crypto.randomUUID();
    await pool.query(
      `INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, user_id, action, entity_type, entity_id, description]
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
    // We don't throw here to avoid breaking the main flow
  }
}

module.exports = {
  logActivity,
};
