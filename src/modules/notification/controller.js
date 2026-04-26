const NotificationService = require('./service');
const { successResponse } = require('../../utils/response');

class NotificationController {
  static async list(req, res, next) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const notifications = await NotificationService.getUserNotifications(userId, limit, page);
      const unreadCount = await NotificationService.getUnreadCount(userId);
      const totalCount = await NotificationService.getNotificationCount(userId);
      
      return successResponse(res, { 
        notifications,
        unreadCount,
        pagination: {
          total: totalCount,
          page,
          limit,
          total_pages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const success = await NotificationService.markAsRead(id, userId);
      if (!success) {
        const error = new Error('Notification not found or access denied');
        error.statusCode = 404;
        throw error;
      }
      
      return successResponse(res, { message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req, res, next) {
    try {
      const userId = req.user.id;
      const count = await NotificationService.markAllAsRead(userId);
      
      return successResponse(res, { 
        message: 'All notifications marked as read',
        count 
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const success = await NotificationService.deleteNotification(id, userId);
      if (!success) {
        const error = new Error('Notification not found or access denied');
        error.statusCode = 404;
        throw error;
      }
      
      return successResponse(res, { message: 'Notification deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async getSettings(req, res, next) {
    try {
      const settings = await NotificationService.getSettings(req.user.id);
      return successResponse(res, settings);
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req, res, next) {
    try {
      const { push_notification, email_summary, important_announcement } = req.body;
      await NotificationService.updateSettings(req.user.id, {
        push_notification: push_notification ? 1 : 0,
        email_summary: email_summary ? 1 : 0,
        important_announcement: important_announcement ? 1 : 0,
      });
      return successResponse(res, { message: 'Settings updated successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NotificationController;
