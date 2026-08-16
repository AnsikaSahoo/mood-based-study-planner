const express = require('express');
const { createMood, getTodayMood, getMoodHistory } = require('../controllers/moodController');
const { createMoodValidation } = require('../validations/moodValidation');
const validate = require('../validations/validate');
const { protect } = require('../middleware/authMiddleware');
const AsyncHandler = require('../utils/AsyncHandler');

const router = express.Router();

router.use(protect);

router.post('/', createMoodValidation, validate, AsyncHandler(createMood));
router.get('/today', AsyncHandler(getTodayMood));
router.get('/history', AsyncHandler(getMoodHistory));

module.exports = router;
