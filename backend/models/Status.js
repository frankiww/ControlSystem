const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Status = sequelize.define('Status', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
});

module.exports = Status;