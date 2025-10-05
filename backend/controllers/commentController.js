//добавить комментарий
//получить все комменты
//удалить коммент

const {Comment} = require('../models');

exports.getAllComments = async(req, res) => {
    try{
        const {defect} = req.query;
        const filter ={};
        if (defect) filter.defect = defect

        const comments = await Comment.findAll(
            {where: filter}
        );
        res.status(200).json(comments);

    } catch(error){
        console.error(error);
        res.status(500).json({error: 'Ошибка при получении комментариев'});
    }
};

exports.addComment = async (req, res) => {
  try {
    const { defect, user } = req.body;

    if (!defect || !user) {
      return res.status(400).json({ error: 'Не указаны обязательные поля: defect или user' });
    }

    const comment = await Comment.create({ defect, user });
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