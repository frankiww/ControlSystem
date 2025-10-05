const express = require('express');
const defectController = require('../controllers/defectController');
const router = express.Router();

router.get('/', defectController.getAllDefects);

router.get('/:id', defectController.getDefectById);

router.post('/', defectController.createDefect);

router.put('/:id', defectController.updateDefect);

router.delete('/:id', defectController.deleteDefect);

module.exports = router;