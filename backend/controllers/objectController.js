const { Object, User, Defect } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.getAllObjects = async (req, res) => {
  try {
    const user = req.user;
    const { client, activeOnly } = req.query;
    const activeOnlyFlag = activeOnly === 'true' || activeOnly === true;
    const filter = {};

    if (client) filter.client = client;

    if (user.role === 'client') {
      filter.client = user.id;
    } else if (user.role === 'engineer') {
      const defects = await Defect.findAll({
        where: {contractor: user.id},
        attributes: ['object'],
      });
      const objectIds = defects.map(d => d.object);
      filter.id = objectIds.length ? objectIds : [-1];
    }

    const objects = await Object.findAll({
       where: filter,
       include: [
        {
          model: User,
          as: 'clientInfo',
          attributes: ['id', 'name'],
        },
       ],
      });

      const result = await Promise.all(
      objects.map(async (obj) => {
        const totalDefects = await Defect.count({
          where: { object: obj.id },
        });
        const activeDefects = await Defect.count({
          where: {
            object: obj.id,
            status: { [Op.notIn]: [4, 5] }, // исключаем "Закрыт" и "Отменен"
          },
        });

        if (activeOnlyFlag && activeDefects === 0) {
          return null;
        }

        return {
          id: obj.id,
          name: obj.name,
          client_name: obj.clientInfo ? obj.clientInfo.name : '—',
          total_defects: totalDefects,
          active_defects: activeDefects,
        };
      })
    );

    
    res.status(200).json(result.filter(Boolean));
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
