const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const History = sequelize.define('History', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    defect: {type: DataTypes.INTEGER, allowNull: false},
    user: {type: DataTypes.INTEGER, allowNull: false},
    data: {type: DataTypes.JSONB, allowNull: false},
});

module.exports = History;