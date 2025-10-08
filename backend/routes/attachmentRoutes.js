const express = require('express');
const attachmentController = require('../controllers/attachmentController');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/:defectId', authMiddleware, attachmentController.getAttachmentsByDefect);

router.post('/', authMiddleware, attachmentController.addAttachment);

router.delete('/:id', attachmentController.deleteAttachment);

module.exports = router;