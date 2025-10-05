const { Object } = require('../models');

exports.getAllObjects = async (req, res) => {
  try {
    const { client, stage } = req.query;
    const filter = {};

    if (client) filter.client = client;
    if (stage !== undefined) filter.stage = stage;

    const objects = await Object.findAll({ where: filter });
    res.status(200).json(objects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении объектов' });
  }
};

exports.addObject = async (req, res) => {
  try {
    const { name, client, stage } = req.body;

    if (!name || !client) {
      return res.status(400).json({ error: 'Необходимо указать name и client' });
    }

    const newObject = await Object.create({
      name,
      client,
      stage: stage ?? 0
    });

    res.status(201).json(newObject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании объекта' });
  }
};
