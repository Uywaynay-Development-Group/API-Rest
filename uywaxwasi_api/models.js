const {DataTypes} = require('sequelize');
const {Sequelize, sequelize} = require('./connection');

const User = sequelize.define('User', {
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
    
}, {tableName: 'users'});

const Vaccine = sequelize.define('Vaccine', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    pet_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {tableName: 'vaccines'});

module.exports = {
    Vaccine,
    User
};
