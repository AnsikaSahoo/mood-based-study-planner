const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const AsyncHandler = require('../utils/AsyncHandler');
const {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

const router = express.Router();

router.use(protect);

router.post('/', AsyncHandler(createNotification));
router.get('/', AsyncHandler(getNotifications));
router.patch('/:id/read', AsyncHandler(markAsRead));
router.delete('/:id', AsyncHandler(deleteNotification));

module.exports = router;
