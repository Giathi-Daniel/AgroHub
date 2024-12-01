/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  console.log("checking if product_pictures table exists...");
  try {
    const exists = await knex.schema.hasTable("product_pictures");
    if (!exists) {
      console.log("creating product_pictures table...");
      await knex.schema.createTable("product_pictures", (table) => {
        table.increments("product_pictures_id").primary();
        table
          .integer("product_id")
          .unsigned()
          .notNullable()
          .unique()
          .references("products.product_id");
        table.specificType('image1_data', 'LONGBLOB').notNullable();
        table.text('image1_name');
        table.specificType('image2_data', 'LONGBLOB');
        table.text('image2_name');
        table.specificType('image3_data', 'LONGBLOB');
        table.text('image3_name');
        table.specificType('image4_data', 'LONGBLOB');
        table.text('image4_name');
      });
      console.log("product_pictures table created successfully");
    } else {
      console.log("product_pictures table exists in database");
    }
  } catch (error) {
    console.log("Error creating product_pictures table");
    console.error(error);
  }
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  console.log('dropping product_pictures table...');
  return await knex.schema.dropTableIfExists('product_pictures');
};
