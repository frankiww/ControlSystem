const { Defect } = require('../models');

exports.getAllDefects = async (req, res) => {
  try {
    const { object, status, engineer } = req.query;
    const filter = {};

    if (object) filter.object = object;
    if (status) filter.status = status;
    if (engineer) filter.engineer = engineer;

    const defects = await Defect.findAll({ where: filter });
    res.status(200).json(defects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении списка дефектов' });
  }
};

exports.getDefectById = async (req, res) => {
  try {
    const { id } = req.params;
    const defect = await Defect.findByPk(id);

    if (!defect) {
      return res.status(404).json({ error: 'Дефект не найден' });
    }

    res.status(200).json(defect);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении дефекта' });
  }
};

exports.createDefect = async (req, res) => {
  try {
    const defectData = req.body;
    const defect = await Defect.create(defectData);
    res.status(201).json(defect);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании дефекта' });
  }
};

exports.updateDefect = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.userId;

    const defect = await Defect.findByPk(id);
    if (!defect) {
      return res.status(404).json({ error: 'Дефект не найден' });
    }

    await defect.update(updateData, {userId});
    res.status(200).json(defect);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при обновлении дефекта' });
  }
};

exports.deleteDefect = async (req, res) => {
  try {
    const { id } = req.params;
    const defect = await Defect.findByPk(id);

    if (!defect) {
      return res.status(404).json({ error: 'Дефект не найден' });
    }

    await defect.destroy();
    res.status(200).json({ message: 'Дефект успешно удалён' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при удалении дефекта' });
  }
};
