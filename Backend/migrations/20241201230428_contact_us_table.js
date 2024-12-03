/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
  console.log('checking if contact_us table exists...');
  try{
    const exists = await knex.schema.hasTable('contact_us');
    if(!exists){
      console.log('creating contact_us table...');
      await knex.schema.createTable('contact_us', table => {
        table.increments('contact_us_id').primary();
        table.string('name', 100).notNullable();
        table.string('email', 100).notNullable();
        table.string('subject', 255).notNullable();
        table.text('message').notNullable();
        table.timestamp('sent_at').defaultTo(knex.fn.now());
        table.string('status', 10).notNullable(); //either read or unread
      })
      console.log('contact_us table created successfully');
    } else {
      console.log('contact_us table exists in database');
    }
  } catch (error){
    console.log('Error creating contact_us table');
    console.error(error);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
  console.log('dropping contact_us table...');
  return await knex.schema.dropTableIfExists('contact_us');
};
