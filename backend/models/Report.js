const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    user: {type: DataTypes.INTEGER, allowNull: false},
    client: {type: DataTypes.INTEGER, allowNull: true},
    filter: {type: DataTypes.JSONB, allowNull: true},
    data: {type: DataTypes.JSONB, allowNull: false},
});

module.exports = Report;