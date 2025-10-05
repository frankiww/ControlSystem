const express = require('express');
const statusController = require('../controllers/statusController');
const router = express.Router();

router.get('/', statusController.getAllStatuses);

module.exports = router;