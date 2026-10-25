const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'recruiting_website',
  waitForConnections: true, connectionLimit: 10
});
const init = () => pool.query(require('fs').readFileSync(__dirname + '/schema.sql', 'utf8'));
module.exports = { pool, init };
