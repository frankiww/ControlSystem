const express = require('express');
const objectController = require('../controllers/objectController');
const router = express.Router();

router.get('/', objectController.getAllObjects);

router.post('/', objectController.addObject);

module.exports = router;