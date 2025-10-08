const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const {authMiddleware} = require('../middleware/authMiddleware');

// router.post('/', authMiddleware, historyController.addHistory);

router.get('/:id', authMiddleware, historyController.getHistoryByDefect);

module.exports = router;
