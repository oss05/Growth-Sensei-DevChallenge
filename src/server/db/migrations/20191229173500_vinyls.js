exports.up = (knex, Promise) => {
    return knex.schema.createTable('vinyls', (table) => {
      table.increments();
      table.string('name').notNullable().unique();
      table.string('genre').notNullable();
      table.integer('rating').notNullable();
      table.integer('year').notNullable();
      table.integer('duration').notNullable();
      table.boolean('explicit').notNullable();
    });
  };
  
  exports.down = (knex, Promise) => {
    return knex.schema.dropTable('vinyls');
  };