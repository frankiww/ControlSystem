const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Defect = sequelize.define('Defect', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    object: {type: DataTypes.INTEGER, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    priority: {type: DataTypes.INTEGER, allowNull: false},
    contractor: {type: DataTypes.INTEGER},
    deadline: {type: DataTypes.DATE, allowNull: false},
    status: {type: DataTypes.INTEGER, allowNull: false},
});

module.exports = Defect;