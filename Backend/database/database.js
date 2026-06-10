const mysql = require('mysql2')
const db = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password : '',
    database : 'honkai_star_retail'
})

module.exports = db

