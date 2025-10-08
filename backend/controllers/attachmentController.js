const {Attachment, History, User} = require('../models');

exports.getAttachmentsByDefect = async (req, res) => {
  try {
    const { defectId } = req.params;

    const attachments = await Attachment.findAll({ 
      where: { defect: defectId } ,
      include: [
        {model: User, attributes: ['id', 'name', 'role'], as: 'User'},
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(attachments);
  } catch (error) {
    console.error('Ошибка при получении вложений:', error);
    res.status(500).json({ message: 'Ошибка при получении вложений' });
  }
};

exports.addAttachment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { defectId, path } = req.body;

    if (!path){
      return res.status(400).json({ message: 'Не указана ссылка на файл' });
    }

    if (req.user.role === 'client'){
      return res.status(400).json({message: 'Не достаточно прав'});
    }

    const attachment = await Attachment.create({ 
      defect: defectId, 
      user: userId,
      path, 
    });

    const user = await User.findByPk(userId);

    await History.create({
      defect: defectId,
      user: userId,
      data: {
        action: 'Добавление вложения',
        message: `${req.user.role === 'manager' ? 'Менеджер' : 'Инженер'} ${user.name} добавил(а) вложение`,
      },
    });

    res.status(201).json(attachment);
  } catch (error) {
    console.error('Ошибка при добавлении вложения:', error);
    res.status(500).json({ message: 'Ошибка при добавлении вложения' });
  }
};


exports.deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Attachment.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Вложение не найдено' });
    }

    res.status(200).json({ message: 'Вложение успешно удалено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при удалении вложения' });
  }
};