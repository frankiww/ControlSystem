const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const History = require('./History');

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

Defect.afterUpdate(async (updatedDefect, options) => {
    const changes = {};
    for (const key of Object.keys(updatedDefect._previousDataValues)){
        if (updatedDefect._previousDataValues[key] !== updatedDefect[key]){
            changes[key] = {
                old: updatedDefect._previousDataValues[key],
                new: updatedDefect[key]
            };
        }
    }

    if (object.keys(changes).length > 0){
        await History.create({
            defect: updatedDefect.id,
            use: options.userId || null,
            data: changes
        });
    }
});

module.exports = Defect;