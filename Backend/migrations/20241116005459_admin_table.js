/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
  console.log('checking if admin table exists...');
  try {
    const exists = await knex.schema.hasTable('admin');
    if (!exists){
      console.log('creating admin table...');
      await knex.schema.createTable('admin', table => {
        table.increments('admin_id').primary();
        table.string('first_name', 25).notNullable();
        table.string('last_name', 25).notNullable();
        table.string('email', 100).notNullable().unique();
        table.string('password_hash').notNullable();
        table.string('phone_number', 25).notNullable();
        table.string('country', 25).notNullable();
        table.string('state', 25).notNullable();
        table.string('LGA', 50).notNullable();
        table.string('address', 200).notNullable();
        table.string('terms', 10).notNullable();
        table.string('status', 10).notNullable();
        table.integer('access_level').notNullable();
      });
      console.log('admin table created successfully');
    } else {
      console.log('admin table exists in database');
    }
  } catch (error){
    console.log('Error creating admin table');
    console.error(error)
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
  console.log('dropping admin table...');
  return await knex.schema.dropTableIfExists('admins');
};
