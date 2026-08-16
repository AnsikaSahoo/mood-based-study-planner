const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const AsyncHandler = require('../utils/AsyncHandler');
const { startSession, endSession, getSessionHistory } = require('../controllers/sessionController');

const router = express.Router();

router.use(protect);

router.post('/start', AsyncHandler(startSession));
router.post('/end', AsyncHandler(endSession));
router.get('/history', AsyncHandler(getSessionHistory));

module.exports = router;
