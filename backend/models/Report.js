const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    user: {type: DataTypes.INTEGER, allowNull: false},
    filter: {type: DataTypes.JSONB, allowNull: false},
    data: {type: DataTypes.JSONB, allowNull: false},
});

module.exports = Report;