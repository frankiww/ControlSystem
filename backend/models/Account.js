const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Account = sequelize.define('Account', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    user: {type: DataTypes.INTEGER, allowNull: false},
    login: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
});

module.exports = Account;