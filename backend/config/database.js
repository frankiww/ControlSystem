require('dotenv').config();
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(
    process.env.name,
    process.env.user,
    process.env.password,
    {
        host: process.env.host,
        port: process.env.port,
        dialect: 'postgres',
        logging: false,
    }
);

module.exports = sequelize;