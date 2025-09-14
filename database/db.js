const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306
});

// Manejo de errores
pool.on('error', (err) => {
    console.error('Error en la conexión a MySQL:', err.code);
});

module.exports = { pool };
