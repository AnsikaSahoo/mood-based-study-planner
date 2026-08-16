const express = require('express');
const { generatePlan, getTodayPlan, regeneratePlan } = require('../controllers/plannerController');
const { protect } = require('../middleware/authMiddleware');
const AsyncHandler = require('../utils/AsyncHandler');

const router = express.Router();

router.use(protect);

router.post('/generate', AsyncHandler(generatePlan));
router.get('/today', AsyncHandler(getTodayPlan));
router.delete('/regenerate', AsyncHandler(regeneratePlan));

module.exports = router;
