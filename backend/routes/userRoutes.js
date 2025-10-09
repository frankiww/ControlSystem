const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, userController.getUsers);

router.post('/', authMiddleware, userController.addUser);

router.put('/:id/deactivate', authMiddleware, userController.deactivateUser);

module.exports = router;