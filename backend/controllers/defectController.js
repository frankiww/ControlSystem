const { Defect, Status, User, Object } = require('../models');

exports.getAllDefects = async (req, res) => {
  try {
    const { object, status, engineer } = req.query;
    const requester = req.user;
    const filter = {};

    if (object) filter.object = object;
    if (status) filter.status = status;
    if (engineer) filter.contractor = engineer;

    if (requester.role === 'engineer'){
      filter.contractor = requester.id
    } else if (requester.role === 'client') {
      const clientObjects = await Object.findAll({
        where: {client: requester.id},
        attributes: ['id'],
      })
      const objectIds = clientObjects.map(o => o.id);
      where.object = objectIds.length ? objectIds : [-1];
    }

    const defects = await Defect.findAll({ 
      where: filter,
include: [
        {
          model: Status,
          as: 'statusInfo',
          attributes: ['name'],
        },
        {
          model: User,
          as: 'engineerInfo',
          attributes: ['id', 'name'],
        },
        {
          model: Object,
          attributes: ['id', 'name'],
          as: 'objectInfo',
          include: [
            {
              model: User,
              as: 'clientInfo',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['id', 'ASC']],
    });

    const formattedDefects = defects.map(d => ({
      id: d.id,
      name: d.name,
      statusName: d.statusInfo?.name || '-',
      engineerName: d.engineerInfo?.name || '-',
      deadline: d.deadline,
      objectName: d.objectInfo?.name || '-',
      clientName: d.Object?.clientInfo?.name || '-',
      priority: d.priority,
    }));

    res.status(200).json(formattedDefects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении списка дефектов' });
  }
};


exports.getDefectById = async (req, res) => {
  const defectId = req.params.id
  try {
    const defect = await Defect.findOne({
      where: { id: defectId },
      include: [
        {
          model: User,
          as: 'engineerInfo',
          attributes: ['id', 'name']
        },
        {
          model: Status,
          as: 'statusInfo',
          attributes: ['id', 'name']
        },
        {
          model: Object,
          attributes: ['id', 'name'],
          as: 'objectInfo',
          include: [
            {
              model: User,
              as: 'clientInfo',
              attributes: ['id', 'name'],
            },
          ],
        },
      ]
    })

    if (!defect) return res.status(404).json({ error: 'Дефект не найден' })

    res.json({
      id: defect.id,
      name: defect.name,
      description: defect.description,
      priority: defect.priority,
      engineerName: defect.engineerInfo?.name,
      statusName: defect.statusInfo?.name,
      clientInfo: defect.clientInfo,
      deadline: defect.deadline,
      objectInfo: defect.objectInfo
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка получения дефекта' })
  }
}

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
