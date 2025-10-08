const { History } = require('../models');

exports.addHistory = async (req, res) => {
  try {
    const { defect, user, data } = req.body;

    if (!defect || !user || !data) {
      return res.status(400).json({ error: 'Необходимо указать defect, user и data' });
    }

    const newRecord = await History.create({
      defect,
      user,
      data
    });

    res.status(201).json(newRecord);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при добавлении записи в историю изменений' });
  }
};

exports.getHistoryByDefect = async (req, res) => {
  try {
    const { id: defectId } = req.params;

    const history = await History.findAll({
      where: { defect: defectId },
      order: [['createdAt', 'DESC']],
    });

    res.json(history);
  } catch (error) {
    console.error('Ошибка при получении истории:', error);
    res.status(500).json({ message: 'Ошибка при получении истории изменений' });
  }
};
