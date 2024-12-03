/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
  console.log('checking if buyers tables exists...');
  try {
    const exists = await knex.schema.hasTable('buyers'); // returns true or false
    
    if(!exists){
      console.log('creating buyers table...');
      await knex.schema.createTable('buyers', table => {
        table.increments('buyer_id').primary();
        table.string('first_name', 25).notNullable();
        table.string('last_name', 25).notNullable();
        table.string('email', 50).notNullable().unique();
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
        // table.timestamp('created_at').defaultTo(knex.fn.now());
        // table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
      console.log('buyers table created successfully');
    } else {
      console.log('buyers table exists in database');
    }
  }catch (error){
    console.log('Error creating buyers table');
    console.error(error);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
  console.log('dropping buyers tables...');
  return await knex.schema.dropTableIfExists('buyers');
};
