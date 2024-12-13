/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
  console.log('checking if shipping table exists...');
  try {
    const exists = await knex.schema.hasTable('shipping');
    if (!exists){
      console.log('creating shipping table...');
      await knex.schema.createTable('shipping', table => {
        table.increments('shipping_id').primary();
        table.integer('buyer_id').unsigned().notNullable();
        table.foreign('buyer_id').references('buyers.buyer_id');
        table.string('shipping_address', 200).notNullable();
        table.string('shipping_method', 100).notNullable();
        table.string('payment_method', 100).notNullable();
        table.decimal('products_price', 8, 2).notNullable();
        table.decimal('delivery_cost', 8, 2).notNullable();
        table.decimal('discount', 8, 2).notNullable();
        table.decimal('final_price', 8, 2).notNullable();
        table.string('shipping_status', 25).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
      console.log('shipping table created successfully');
    } else {
      console.log('shipping table exists in database');
    }
  } catch (error){
    console.log('Error creating shipping table');
    console.error(error)
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
  console.log('dropping shipping table...');
  return await knex.schema.dropTableIfExists('shipping');
};
