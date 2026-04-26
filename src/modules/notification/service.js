const crypto = require('crypto');
const NotificationModel = require('./model');

class NotificationService {
  static async getUserNotifications(userId, limit = 50, page = 1) {
    const offset = (page - 1) * limit;
    return await NotificationModel.listByUserId(userId, limit, offset);
  }

  static async getNotificationCount(userId) {
    return await NotificationModel.countByUserId(userId);
  }

  static async markAsRead(id, userId) {
    return await NotificationModel.markAsRead(id, userId);
  }

  static async markAllAsRead(userId) {
    return await NotificationModel.markAllAsRead(userId);
  }

  static async deleteNotification(id, userId) {
    return await NotificationModel.delete(id, userId);
  }

  static async createNotification(userId, { title, message, type, metadata }) {
    const id = crypto.randomUUID();
    await NotificationModel.create({
      id,
      user_id: userId,
      title,
      message,
      type,
      metadata
    });
    return id;
  }

  /**
   * Utility to send notification to a user
   */
  static async send(userId, title, message, type = 'info', metadata = null) {
    return this.createNotification(userId, { title, message, type, metadata });
  }

  static async getUnreadCount(userId) {
    return await NotificationModel.getUnreadCount(userId);
  }

  static async getSettings(userId) {
    return await NotificationModel.getSettings(userId);
  }

  static async updateSettings(userId, settings) {
    return await NotificationModel.updateSettings(userId, settings);
  }

  /**
   * Broadcast notification to multiple users based on school and role
   */
  static async broadcast(sekolahId, { title, message, type = 'info', targetRole = 'all' }) {
    const { pool } = require('../../config/db');
    let query = 'SELECT id FROM users WHERE sekolah_id = ?';
    const params = [sekolahId];

    if (targetRole !== 'all') {
      query += ' AND role = ?';
      params.push(targetRole);
    }

    const [users] = await pool.query(query, params);
    
    const promises = users.map(user => 
      this.send(user.id, title, message, type)
    );

    await Promise.all(promises);
    return users.length;
  }

  /**
   * Send notification to all students in a specific class (rombel)
   */
  static async broadcastToClass(rombelId, { title, message, type = 'info', metadata = null }) {
    const { pool } = require('../../config/db');
    
    // Find users who are students in this rombel
    const [users] = await pool.query(
      `SELECT u.id 
       FROM users u
       JOIN peserta_didik pd ON u.ref_id = pd.id AND u.role = 'siswa'
       JOIN anggota_rombel ar ON pd.id = ar.peserta_didik_id
       WHERE ar.rombel_id = ?`,
      [rombelId]
    );

    const promises = users.map(user => 
      this.send(user.id, title, message, type, metadata)
    );

    await Promise.all(promises);
    return users.length;
  }
}

module.exports = NotificationService;
