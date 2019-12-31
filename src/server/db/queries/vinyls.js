const knex = require('../connection');

function getAllvinyls() {
    return knex('vinyls')
    .select('*');
  }
  
  module.exports = {
    getAllvinyls
  };