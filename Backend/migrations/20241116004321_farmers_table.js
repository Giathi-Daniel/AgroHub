/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
  console.log('checking if farmers table exists...');
  try{
    const exists = await knex.schema.hasTable('farmers');
    if(!exists){
      console.log('creating farmers table...');
      await knex.schema.createTable('farmers', table => {
        table.increments('farmer_id').primary();
        table.string('first_name', 25).notNullable();
        table.string('last_name', 25).notNullable();
        table.string('farm_name', 50).notNullable();
        table.string('farm_size', 25).notNullable();
        table.string('email', 100).notNullable().unique();
        table.string('password_hash').notNullable();
        table.string('phone_number', 25).notNullable();
        table.string('country', 25).notNullable();
        table.string('state', 25).notNullable();
        table.string('LGA', 50).notNullable();
        table.string('address', 200).notNullable();
        table.specificType('image_data', 'LONGBLOB');
        table.text('image_name');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.string('terms', 10).notNullable();
        table.string('status', 10).notNullable();
      })
      console.log('farmers table created successfully');
    } else {
      console.log('farmers table exists in database');
    }
  } catch (error){
    console.log('Error creating farmers table');
    console.error(error);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
  console.log('dropping farmers table...');
  return await knex.schema.dropTableIfExists('farmers');
};
