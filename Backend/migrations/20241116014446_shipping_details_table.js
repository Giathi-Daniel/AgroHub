/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {

  console.log('checking if table exists...');
  try {
    const exists = await knex.schema.hasTable('shipping_details');
    if (!exists){
      console.log('creating shipping_detail table...');
      await knex.schema.createTable('shipping_details', table => {
        table.increments('shipping_detail_id').primary();
        table.integer('farmer_id').unsigned().notNullable().references('farmers.farmer_id');
        table.integer('product_id').unsigned().notNullable().references('products.product_id');
        table.integer('quantity').notNullable();
        table.decimal('price_per_unit', 8, 2).notNullable();
        table.decimal('price', 8, 2).notNullable();
      });
      console.log('shipping_details table created successfully');
    } else {
      console.log('shipping_details table exists in database');
    }
  } catch (error){
    console.log('Error creating shipping_details table');
    console.error(error);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
  console.log('dropping shipping_details...');
  return await knex.schema.dropTableIfExists('shipping_details');
};
