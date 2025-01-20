const { sql } = require('@vercel/postgres');
const { createTables } = require('../lib/db');

async function migrate() {
  try {
    await createTables();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();

