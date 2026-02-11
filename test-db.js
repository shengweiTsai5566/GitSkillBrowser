const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:password@127.0.0.1:5433/skillbrowser"
});

async function test() {
  try {
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Query result:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection error:", err.message);
    process.exit(1);
  }
}

test();
