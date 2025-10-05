const express = require('express');
const attachmentController = require('../controllers/attachmentController');
const router = express.Router();

router.get('/', attachmentController.getAllAttachments);

router.post('/', attachmentController.addAttachment);

router.delete('/:id', attachmentController.deleteAttachment);

module.exports = router;