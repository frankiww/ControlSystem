const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/', userController.addUser);

router.patch('/:id/deactivate', userController.deactivateUser);

router.post('/', userController.login);

module.exports = router;