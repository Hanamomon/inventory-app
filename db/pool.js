require('dotenv').config();

const { Pool } = require('pg');

const { DATABASE_URL } = process.env;

module.exports = new Pool({
  connectionString: DATABASE_URL
});