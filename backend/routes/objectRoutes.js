const express = require('express');
const objectController = require('../controllers/objectController');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, objectController.getAllObjects);

router.get('/:id', authMiddleware, objectController.getObjectById);

router.post('/', objectController.addObject);

module.exports = router;