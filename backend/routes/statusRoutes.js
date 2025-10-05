const express = require('express');
const statusController = require('../controllers/statusController');
const router = express.Router();

router.get('/', statusController.statusController);

module.exports = router;