const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, userController.getUsers);

router.post('/', userController.addUser);

router.patch('/:id/deactivate', userController.deactivateUser);

module.exports = router;