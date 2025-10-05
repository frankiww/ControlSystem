const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    defect: {type: DataTypes.INTEGER, allowNull: false},
    user: {type: DataTypes.INTEGER, allowNull: false},
    text: {type: DataTypes.TEXT, allowNull: false},
});

module.exports = Comment;