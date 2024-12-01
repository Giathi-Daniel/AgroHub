/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  console.log("checking if buyer_profile table exists...");
  try {
    const exists = await knex.schema.hasTable("buyer_profile");
    if (!exists) {
      console.log("creating buyer_profile table...");
      await knex.schema.createTable("buyer_profile", (table) => {
        table.increments("buyer_profile_id").primary();
        table
          .integer("buyer_id")
          .unsigned()
          .notNullable()
          .unique()
          .references("buyers.buyer_id");
        table.specificType('image_data', 'LONGBLOB').notNullable();
        table.text('image_name');
      });
      console.log("buyer_profile table created successfully");
    } else {
      console.log("buyer_profile table exists in database");
    }
  } catch (error) {
    console.log("Error creating buyer_profile table");
    console.error(error);
  }
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  console.log('dropping buyer_profile table...');
  return await knex.schema.dropTableIfExists('buyer_profile');
};
