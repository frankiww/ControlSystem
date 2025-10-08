const express = require('express');
const commentController = require('../controllers/commentController');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/:defectId', authMiddleware, commentController.getCommentsByDefect);

router.post('/', authMiddleware, commentController.addComment);

// router.delete('/:id', commentController.deleteComment);

module.exports = router;