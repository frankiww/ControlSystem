const { Defect, Status, User, Object, History } = require('../models');

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
      filter.object = objectIds.length ? objectIds : [-1];
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
      engineerInfo: defect.engineerInfo,
      statusName: defect.statusInfo?.name,
      clientInfo: defect.clientInfo,
      deadline: defect.deadline,
      objectInfo: defect.objectInfo,
      createdAt: defect.createdAt
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

exports.assignEngineer = async (req, res) => {
  try {
    const { engineerId } = req.body;
    const defectId = req.params.id;
    const managerId = req.user.id;

    if (req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Недостаточно прав для выполнения действия' });

    }

    const defect = await Defect.findByPk(defectId);
    if (!defect) return res.status(404).json({ error: 'Дефект не найден' });

    if (defect.engineer) {
      return res.status(400).json({ error: 'Инженер уже назначен' });
    }

    const engineer = await User.findByPk(engineerId);
    if (!engineer || engineer.role !== 2) {
      return res.status(400).json({ error: 'Некорректный инженер' });
    }

    const manager = await User.findByPk(managerId);
    if (!manager || manager.role !== 1) {
      return res.status(400).json({ error: 'Некорректный менеджер' });
    }


    const workStatus = await Status.findOne({ where: { name: 'В работе' } });
        if (!workStatus) {
      return res.status(400).json({ error: 'Статус "В работе" не найден' });
    }
    defect.contractor = engineerId;
    defect.status = workStatus.id;
    await defect.save();

    await History.create({
      defect: defect.id,
      user: managerId,
      data: {
        action: 'Назначение инженера',
        message: `Менеджер ${manager.name} назначил(а) инженера ${engineer.name}`,
      },
    });


    res.json({ message: 'Инженер успешно назначен', defect });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при назначении инженера' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const defectId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;

    const defect = await Defect.findByPk(defectId, {
      include: [{ model: Status, as: 'statusInfo' }],
    });
    if (!defect) return res.status(404).json({ error: 'Дефект не найден' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    const newStatus = await Status.findOne({ where: { name: status } });
    if (!newStatus) return res.status(400).json({ error: 'Некорректный статус' });

    if (user.role === 2) {
      // инженер может только "В работе" -> "На проверке"
      if (defect.statusInfo.name !== 'В работе' || newStatus.name !== 'На проверке') {
        return res.status(403).json({ error: 'Инженер не может изменить статус на этот' });
      }
    } else if (user.role === 1) {
      // менеджер может менять только "На проверке" -> "Закрыт"/"Отменен"
      if (
        defect.statusInfo.name !== 'На проверке' ||
        !['Закрыт', 'Отменен'].includes(newStatus.name)
      ) {
        return res.status(403).json({ error: 'Менеджер может только принять или отклонить дефект' });
      }
    } else {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }

    defect.status = newStatus.id;
    await defect.save();

    await History.create({
      defect: defect.id,
      user: user.id,
      data: {
        action: 'Изменение статуса',
        message: `${user.role === 1 ? 'Менеджер' : 'Инженер'} ${
          user.name
        } изменил статус на "${newStatus.name}"`,
      },
    });

    res.json({ message: 'Статус успешно изменён', defect });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при изменении статуса дефекта' });
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
