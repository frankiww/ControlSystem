const bcrypt = require('bcrypt');
const { User, Account, Role } = require('../models');

exports.addUser = async (req, res) => {
  try {
    const { name, role, login, password } = req.body;

    if (!name || !role || !login || !password) {
      return res.status(400).json({ error: 'Необходимо указать name, role, login и password' });
    }

    const existingAccount = await Account.findOne({ where: { login } });
    if (existingAccount) {
      return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
    }

    const newUser = await User.create({ name, role, active: true });

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
