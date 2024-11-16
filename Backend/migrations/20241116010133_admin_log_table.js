/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
  console.log('checking if admin_log table exists...');
  try {
    const exists = await knex.schema.hasTable('admin_log');
    if (!exists){
      console.log('creating admin_log table...');
      await knex.schema.createTable('admin_log', table => {
        table.increments('admin_log_id').primary();
        table.integer('admin_id').unsigned().notNullable();
        table.foreign('admin_id').references('admin.admin_id');
        table.timestamp('log_time').defaultTo(knex.fn.now());
        table.text('action').notNullable();
      });
      console.log('admin_log table created successfully');
    } else {
      console.log('admin_log table exists in database');
    }
  } catch (error){
    console.log('Error creating admin_log table');
    console.error(error)
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
  console.log('dropping admin_log table...');
  return await knex.schema.dropTableIfExists('admin_log');
};
