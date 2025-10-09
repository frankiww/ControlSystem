const express = require('express');
const roleController = require('../controllers/roleController');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');


router.get('/', authMiddleware, roleController.getAllRoles);

module.exports = router;