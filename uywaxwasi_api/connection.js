const {Sequelize} = require('sequelize');

const database = "uywaxwasi_db"
const username = "postgres"
const password = "Contrax-000%"
const host = "localhost"
const port = "5432"

const sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: 'postgres'
});

module.exports = {
    sequelize
}
