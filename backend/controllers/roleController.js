const {Role} = require('../models');

exports.getAllRoles = async(req, res) => {
    try{
        const roles = await Role.findAll();
        res.status(200).json(roles);

    } catch(error){
        console.error(error);
        res.status(500).json({error: 'Ошибка при получении ролей'});
    }
};