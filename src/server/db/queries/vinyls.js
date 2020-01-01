const knex = require('../connection');

function getAllVinyls() {
  return knex('vinyls')
    .select('*');
}

function getSingleVinyl(id) {
  return knex('vinyls')
    .select('*')
    .where({ id: parseInt(id) });
}

function addVinyl(vinyl) {
  return knex('vinyls')
  .insert(vinyl)
  .returning('*');
}

function updateVinyl(id, vinyl) {
  return knex('vinyls')
  .update(vinyl)
  .where({ id: parseInt(id) })
  .returning('*');
}

function deleteVinyl(id) {
  return knex('vinyls')
  .del()
  .where({ id: parseInt(id) })
  .returning('*');
}

module.exports = {
  getAllVinyls,
  getSingleVinyl,
  addVinyl,
  updateVinyl,
  deleteVinyl
};