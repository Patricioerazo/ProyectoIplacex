
//1.llamar al modulo
const mysql = require('mysql');
const connection = mysql.createConnection({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306
    
});

connection.connect((error)=>{
    if (error) {
        console.log('el error de conectar es :' +error);
        return;
    }
    console.log('Conectado ok');
});

module.exports = connection;