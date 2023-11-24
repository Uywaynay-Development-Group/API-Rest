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

const Pet = sequelize.define('Pet', {
    name: {
        type:DataTypes.STRING,
        allowNull: false
    },

    type: {
        type:DataTypes.STRING,
        allowNull: false
    },

    breed: {
        type:DataTypes.STRING,
        allowNull: false
    },

    age: {
        type:DataTypes.INTEGER,
        allowNull: false
    },

    icon_url: {
        type:DataTypes.STRING
    },

}, {tableName: 'pets'});

// User ----< Pet

User.hasMany(Pet, {as: "pets", foreignKey: "userId"});
Pet.belongsTo(User, {
    foreignKey: "userId"
});

// Pet ----< Vaccine
Pet.hasMany(Vaccine, {as: "vaccines", foreignKey: "petId"});
Vaccine.belongsTo(Pet, {
    foreignKey: "petId"
});

// User ----< Vaccine
User.hasMany(Vaccine, {as: "vaccines", foreignKey: "userId"});
Vaccine.belongsTo(User, {
    foreignKey: "userId"
});

module.exports = {
    Vaccine,
    User,
    Pet
};
