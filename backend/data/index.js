const knex = require('knex');
const knexConfig = require('../knexfile');
require('dotenv').config();
// console.log(knexConfig);

module.exports = knex(knexConfig[process.env.NODE_ENV]);
