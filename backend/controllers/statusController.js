const {Status} = require('../models');

exports.getAllStatuses = async(req, res) => {
    try{
        const statuses = await Status.findAll();
        res.status(200).json(statuses);

    } catch(error){
        console.error(error);
        res.status(500).json({error: 'Ошибка при получении статусов'});
    }
};