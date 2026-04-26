const { pool } = require('../../config/db');

class NotificationModel {
  static async listByUserId(userId, limit = 50, offset = 0) {
    const [rows] = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  }

  static async countByUserId(userId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as total FROM notifications WHERE user_id = ?',
      [userId]
    );
    return rows[0].total;
  }

  static async markAsRead(id, userId) {
    const [result] = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }

  static async markAllAsRead(userId) {
    const [result] = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
      [userId]
    );
    return result.affectedRows;
  }

  static async delete(id, userId) {
    const [result] = await pool.query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }

  static async create(data) {
    const { id, user_id, title, message, type = 'info', metadata = null } = data;
    await pool.query(
      `INSERT INTO notifications (id, user_id, title, message, type, metadata) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, user_id, title, message, type, metadata ? JSON.stringify(metadata) : null]
    );
    return id;
  }

  static async getUnreadCount(userId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
    return rows[0].count;
  }

  static async getSettings(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM user_notification_settings WHERE user_id = ?',
      [userId]
    );
    return rows[0] || {
      push_notification: 1,
      email_summary: 0,
      important_announcement: 1
    };
  }

  static async updateSettings(userId, settings) {
    const { push_notification, email_summary, important_announcement } = settings;
    
    // Upsert logic
    const [result] = await pool.query(
      `INSERT INTO user_notification_settings 
       (user_id, push_notification, email_summary, important_announcement) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       push_notification = VALUES(push_notification),
       email_summary = VALUES(email_summary),
       important_announcement = VALUES(important_announcement)`,
      [userId, push_notification, email_summary, important_announcement]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = NotificationModel;
