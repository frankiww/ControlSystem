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
