import fs from 'fs/promises';

export let db;

async function example() {
  try {
    const data = await fs.readFile('./db.json', { encoding: 'utf8' });
    db = JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
}
example();


