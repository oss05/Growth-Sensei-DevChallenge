exports.seed = (knex, Promise) => {
  return knex('vinyls').del()
  .then(() => {
    return knex('vinyls').insert({
      name: 'The Primrose Path',
      genre: 'Orchestra',
      rating: 10,
      year: 2012,
      duration: 65,
      explicit: false
    });
  })
  .then(() => {
    return knex('vinyls').insert({
      name: 'Little Night Music',
      genre: 'Pop Orchestra',
      rating: 9,
      year: 2015,
      duration: 58,
      explicit: false
    });
  })
  .then(() => {
    return knex('vinyls').insert({
      name: 'Sleepwalking',
      genre: 'Pop',
      rating: 9,
      year: 2019,
      duration: 60,
      explicit: true
    });
  });
};