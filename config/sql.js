const mysql = require("mysql2");

module.exports = () => mysql.createConnecion({
    "host": "localhost",
    "user": "root",
    "password":"",
    "database": "hifi"
});