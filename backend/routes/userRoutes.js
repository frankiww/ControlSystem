const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/', userController.addUser);

router.patch('/:id/deactivate', userController.deactivateUser);

module.exports = router;