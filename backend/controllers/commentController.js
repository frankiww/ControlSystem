const {Comment, User, History} = require('../models');

exports.getCommentsByDefect = async (req, res) => {
  try {
    const { defectId } = req.params;

    const comments = await Comment.findAll({
      where: { defect: defectId },
      include: [
        { model: User, attributes: ['id', 'name', 'role'], as: 'User' },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(comments);
  } catch (error) {
    console.error('Ошибка при получении комментариев:', error);
    res.status(500).json({ message: 'Ошибка при получении комментариев' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { defectId, text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Текст комментария обязателен' });
    }

    if (req.user.role === 'client'){
      return res.status(400).json({message: 'Не достаточно прав'});
    }

    const comment = await Comment.create({
      defect: defectId,
      user: userId,
      text,
    });

    await History.create({
      defect: defectId,
      user: userId,
      data: {
        action: 'Добавление комментария',
        message: `${req.user.role === 'manager' ? 'Менеджер' : 'Инженер'} ${req.user.name} добавил(а) новый комментарий`,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при добавлении комментария' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Comment.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Комментарий не найден' });
    }

    res.status(200).json({ message: 'Комментарий успешно удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при удалении комментария' });
  }
};