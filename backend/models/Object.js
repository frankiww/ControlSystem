const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Object = sequelize.define('Object', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    client: {type: DataTypes.INTEGER, allowNull: false},
    stage: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
});

module.exports = Object;