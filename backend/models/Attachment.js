const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Attachment = sequelize.define('Attachment', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    defect: {type: DataTypes.INTEGER, allowNull: false},
    path: {type: DataTypes.STRING, allowNull: false},
});

module.exports = Attachment;