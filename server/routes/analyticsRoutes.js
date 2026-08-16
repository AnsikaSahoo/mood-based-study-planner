const express = require('express');
const { getWeekly, getMonthly, getProgress, getDashboard } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const AsyncHandler = require('../utils/AsyncHandler');

const router = express.Router();

router.use(protect);

router.get('/weekly', AsyncHandler(getWeekly));
router.get('/monthly', AsyncHandler(getMonthly));
router.get('/progress', AsyncHandler(getProgress));
router.get('/dashboard', AsyncHandler(getDashboard));

module.exports = router;
