import pkg from 'pg';
const { Pool } = pkg;

async function run() {
  const pool = new Pool({
    user: 'ai_studio_admin',
    password: process.env.SQL_ADMIN_PASSWORD,
    host: process.env.SQL_HOST,
    database: process.env.SQL_DB_NAME,
  });

  try {
    await pool.query(`GRANT ALL ON SCHEMA public TO ${process.env.SQL_USER};`);
    console.log('Granted permissions successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
