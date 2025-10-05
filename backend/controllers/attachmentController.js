const {Attachment} = require('../models');

exports.getAllAttachments = async(req, res) => {
    try{
        const {defect} = req.query;
        const filter ={};
        if (defect) filter.defect = defect;

        const attachments = await Attachment.findAll(
            {where: filter}
        );
        res.status(200).json(attachments);

    } catch(error){
        console.error(error);
        res.status(500).json({error: 'Ошибка при получении вложений'});
    }
};

exports.addAttachment = async (req, res) => {
  try {
    const { defect, path } = req.body;

    if (!defect || !path) {
      return res.status(400).json({ error: 'Не указаны обязательные поля: defect или path' });
    }

    const attachment = await Attachment.create({ defect, path });
    res.status(201).json(attachment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при добавлении вложения' });
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