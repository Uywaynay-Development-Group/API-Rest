const {Sequelize} = require('sequelize');

const database = "uywaxwasi_db"
const username = "administrador"
const password = "vE7CMVIBkCI8LNGFSUZQzPz6iYfdwEeH"
const host = "dpg-clgo5n31hq4c73dfj72g-a"
const port = "5432"

const sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: 'postgres'
});

module.exports = {
    sequelize
}
