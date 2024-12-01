/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  console.log("checking if farmer_profile table exists...");
  try {
    const exists = await knex.schema.hasTable("farmer_profile");
    if (!exists) {
      console.log("creating farmer_profile table...");
      await knex.schema.createTable("farmer_profile", (table) => {
        table.increments("farmer_profile_id").primary();
        table
          .integer("farmer_id")
          .unsigned()
          .notNullable()
          .unique()
          .references("farmers.farmer_id");
        table.specificType('image_data', 'LONGBLOB').notNullable();
        table.text('image_name');
      });
      console.log("farmer_profile table created successfully");
    } else {
      console.log("farmer_profile table exists in database");
    }
  } catch (error) {
    console.log("Error creating farmer_profile table");
    console.error(error);
  }
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  console.log('dropping farmer_profile table...');
  return await knex.schema.dropTableIfExists('farmer_profile');
};
