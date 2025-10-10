const { Report, User, Object, Defect, Status } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.createReport = async (req, res) => {
  try {
    const requester = req.user;
    const { name, client, filter } = req.body;

    if (requester.role !== 'manager') {
      return res.status(403).json({ message: 'Создавать отчёты могут только менеджеры' });
    }

    if (client) {
      const targetClient = await User.findByPk(client);
      if (!targetClient) {
        return res.status(404).json({ message: 'Указанный клиент не найден' });
      }
    }

    const where = {}

    //по объекту
    if (filter?.object) {
      where.object = filter.object;
    } else if (client) {
      //по всем объектам клиента
      const clientObjects = await Object.findAll({where: {client}})
      const objectIds = clientObjects.map(obj => obj.id);
      where.object = {[Op.in]: objectIds};
    }

    if (filter?.period?.from && filter?.period?.to) {
      where.createdAt = {[Op.between]: [filter.period.from, filter.period.to]};
    }

    const defects = await Defect.findAll({
      where,
      include: [{model: Status, as: 'statusInfo', attributes: ['name']}],
    });

    const statusCount = {};
    for (const defect of defects) {
      const statusName = defect.Status?.name || '-';
      statusCount[statusName] = (statusCount[statusName] || 0) + 1;
    }

    const data = {
      statuses: statusCount,
      total: defects.length,
    }

    const report = await Report.create({
      name,
      user: requester.id,
      client: client || null,
      filter,
      data,
    });

    res.status(201).json(report);
  } catch (err) {
    console.error('Ошибка при создании отчёта:', err);
    res.status(500).json({ message: 'Ошибка при создании отчёта' });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const requester = req.user;

    let where = {};

    if (requester.role === 'client') {
      where = { client: requester.id };
    } else if (requester.role === 'engineer') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    } 

    const reports = await Report.findAll({
      where,
      include: [
        { model: User, as: 'manager', attributes: ['id', 'name'] },
        { model: User, as: 'recipient', attributes: ['id', 'name'] },
      ],
      order: [['id', 'DESC']],
    });

      for (const report of reports) {
        const objectId = report.filter?.object;
        if (objectId) {
          const object = await Object.findByPk(objectId, { attributes: ['name'] });
          report.dataValues.objectName = object ? object.name : null;
        } else {
          report.dataValues.objectName = null;
        }
      }

    res.status(200).json(reports);
  } catch (err) {
    console.error('Ошибка получения отчётов:', err);
    res.status(500).json({ message: 'Ошибка получения отчётов' });
  }
}
