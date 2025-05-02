/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
  console.log('checking if cart table exists...');
  try{
    const exists = await knex.schema.hasTable('cart');
    if(!exists){
      console.log('creating cart table...');
      await knex.schema.createTable('cart', table => {
        table.increments('cart_id').primary();
        table
          .integer("buyer_id")
          .unsigned()
          .notNullable()
          .unique()
          .references("buyers.buyer_id");
        table.text('cart_items').notNullable();
      })
      console.log('cart table created successfully');
    } else {
      console.log('cart table exists in database');
    }
  } catch (error){
    console.log('Error creating cart table');
    console.error(error);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
  console.log('dropping cart table...');
  return await knex.schema.dropTableIfExists('cart');
};

