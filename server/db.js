const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
    user: process.env.NME,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    host: process.env.PGHOST,
    database: 'todoapp',
    schema: 'public', 
})

module.exports = pool

