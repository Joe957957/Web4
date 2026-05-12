const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'rail_fares.sqlite3');

let database;

function openDatabase() {
  if (!database) {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    database = new sqlite3.Database(dbPath);
  }

  return database;
}

function run(sql, params = []) {
  const db = openDatabase();
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  const db = openDatabase();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  const db = openDatabase();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

async function init() {
  openDatabase();
  await run(`
    CREATE TABLE IF NOT EXISTS price_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      record_date TEXT NOT NULL,
      item_name TEXT NOT NULL,
      price REAL NOT NULL,
      source_site TEXT NOT NULL,
      note TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )
  `);

  const existing = await get('SELECT COUNT(*) AS count FROM price_records');
  if (existing && existing.count === 0) {
    const seedRows = [
      ['2025-06-22', '台北-板橋區間車', 15, '台鐵票價查詢頁面', '調漲前示範資料'],
      ['2025-06-23', '台北-板橋區間車', 22, '台鐵票價查詢頁面', '調漲後示範資料'],
      ['2025-06-22', '台北-花蓮自強號全票', 440, '台鐵官方網站', '調漲前示範資料'],
      ['2025-06-23', '台北-花蓮自強號全票', 583, '台鐵官方網站', '調漲後示範資料'],
      ['2025-06-22', '台北-左營自強號全票', 824, '台鐵新聞公告', '調漲前示範資料'],
      ['2025-06-23', '台北-左營自強號全票', 975, '台鐵新聞公告', '調漲後示範資料']
    ];

    for (const row of seedRows) {
      await run(
        `INSERT INTO price_records (record_date, item_name, price, source_site, note)
         VALUES (?, ?, ?, ?, ?)`,
        row
      );
    }
  }
}

module.exports = {
  init,
  run,
  get,
  all,
  dbPath
};