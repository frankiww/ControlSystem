const express = require('express');
const defectController = require('../controllers/defectController');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, defectController.getAllDefects);

router.get('/:id', authMiddleware, defectController.getDefectById);

router.put('/:id/assign', authMiddleware, defectController.assignEngineer);

router.put('/:id/status', authMiddleware, defectController.updateStatus);

router.post('/', authMiddleware, defectController.createDefect);

router.put('/:id', defectController.updateDefect);

router.delete('/:id', defectController.deleteDefect);

module.exports = router;