const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Account, User, Role } = require('../models');

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const account = await Account.findOne({ where: { login } });
    if (!account) {
      return res.status(404).json({ error: "Аккаунт не найден" });
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Неверный пароль" });
    }

    const user = await User.findByPk(account.user, {
      include: { model: Role, attributes: ["name"] },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    if (!user.active) {
      return res.status(404).json({ error: "Пользователь деактивирован" });
    }

    //генерация JWT-токена
    const token = jwt.sign(
      { id: user.id, role: user.Role.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } //1 день
    );

    res.status(200).json({
      message: "Авторизация успешна",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.Role.name,
      },
    });
  } catch (error) {
    console.error("Ошибка при авторизации:", error);
    res.status(500).json({ error: "Ошибка при авторизации" });
  }
};
