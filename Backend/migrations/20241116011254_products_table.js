/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
  console.log('checking if products table exists...');
  try {
    const exists = await knex.schema.hasTable('products');
    if (!exists){
      console.log('creating products table...');
      await knex.schema.createTable('products', (table) => {
        table.increments('product_id').primary();
        table.integer('farmer_id').unsigned().notNullable();
        table.foreign('farmer_id').references('farmers.farmer_id');
        table.string('product_name', 25).notNullable();
        table.string('product_group', 25).notNullable();
        table.string('product_class', 25).notNullable();
        table.text('description').notNullable();
        table.decimal('price', 8, 2).notNullable();
        table.decimal('discount', 8, 2).notNullable();
        table.string('status', 20).notNullable();
        table.binary('image_data').notNullable();
        table.text('image_name')
      })
      console.log('products table created successfully');
    } else {
      console.log('products table exists in database');
    }
  } catch (error) {
    console.log('Error creating products table');
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
  console.log('dropping products table...');
  return await knex.schema.dropTableIfExists('products');
};
