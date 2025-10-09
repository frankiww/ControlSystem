const bcrypt = require('bcrypt');
const { User, Account, Role, Object, Defect } = require('../models');
const { Op } = require('sequelize');

exports.getUsers = async (req, res) => {
  try {
    const requester = req.user;
    let { role, active, login } = req.query;

    const include = [{ model: Role, attributes: ['name'] }];

    if (role) {
      include[0].where = { name: role };
    }

    if (active !== undefined) {
      active = active === 'true';
    }

    if (active === undefined) {
      active = true;
    }

    if (login) {
      include.push({
        model: Account,
        attributes: ['login']
      });
    }

    if (requester.role === 'manager') {
      const users = await User.findAll({ where: {active}, include });
      return res.status(200).json(users);
    }

    if (requester.role === 'engineer') {
      const defects = await Defect.findAll({
        where: { contractor: requester.id, active },
        attributes: [],
        include: [
          {
            model: Object,
            as: 'objectInfo',
            attributes: ['client'],
          }
        ]
      });

      const clientIds = [...new Set(defects.map(d => d.objectInfo.client))];

      const users = await User.findAll({
        where: { id: { [Op.in]: clientIds }, active },
        include: { model: Role, attributes: ['name'] },
      });

      return res.status(200).json(users);
    }

    if (requester.role === 'client') {
      const user = await User.findByPk(requester.id, { include });
      return res.status(200).json([user]);
    }

    res.status(403).json({ error: 'Нет доступа' });
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, role, login, password } = req.body;
    const requester = req.user;

    if (!name || !role || !login || !password) {
      return res.status(400).json({ error: 'Необходимо указать name, role, login и password' });
    }

    if (requester.role !== 'manager') {
      return res.status(400).json({ error: 'Недостаточно прав' });
    }

    const existingAccount = await Account.findOne({ where: { login } });
    if (existingAccount) {
      return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
    }

    const roleId = await Role.findOne({where: {name: role}})
    if (!roleId) {
      return res.status(400).json({ error: 'Некорректная роль' });
    }

    const newUser = await User.create({ name, role: roleId.id, active: true });

    // хэш пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    await Account.create({
      user: newUser.id,
      login,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Пользователь успешно создан', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании пользователя' });
  }
};

exports.deactivateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const requester = req.user;

    if (requester.role !== 'manager') {
      return res.status(400).json({ error: 'Недостаточно прав' });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    user.active = false;
    await user.save();

    res.status(200).json({ message: 'Пользователь деактивирован' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при деактивации пользователя' });
  }
};
