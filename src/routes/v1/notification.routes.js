const express = require('express');
const NotificationController = require('../../modules/notification/controller');
const router = express.Router();

router.get('/settings', NotificationController.getSettings);
router.put('/settings', NotificationController.updateSettings);
router.get('/', NotificationController.list);
router.patch('/read-all', NotificationController.markAllAsRead);
router.patch('/:id/read', NotificationController.markAsRead);
router.delete('/:id', NotificationController.delete);

module.exports = router;
