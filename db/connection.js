const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'jshmtchllsql',
        database: 'employee_tracker'
    },
    console.log("You're connected to the employee database. :)")
);

module.exports = db