const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/records', async (req, res) => {
  const { q = '', itemName = '', sourceSite = '', from = '', to = '' } = req.query;

  const filters = [];
  const values = [];

  if (q) {
    filters.push('(item_name LIKE ? OR source_site LIKE ?)');
    values.push(`%${q}%`, `%${q}%`);
  }

  if (itemName) {
    filters.push('item_name LIKE ?');
    values.push(`%${itemName}%`);
  }

  if (sourceSite) {
    filters.push('source_site LIKE ?');
    values.push(`%${sourceSite}%`);
  }

  if (from) {
    filters.push('record_date >= ?');
    values.push(from);
  }

  if (to) {
    filters.push('record_date <= ?');
    values.push(to);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const records = await db.all(
    `SELECT id, record_date, item_name, price, source_site, note, created_at
     FROM price_records
     ${whereClause}
     ORDER BY record_date DESC, id DESC`,
    values
  );

  res.json({ records });
});

app.get('/api/summary', async (req, res) => {
  const { itemName = '' } = req.query;

  const params = itemName ? [`%${itemName}%`] : [];
  const whereClause = itemName ? 'WHERE item_name LIKE ?' : '';

  const summary = await db.get(
    `SELECT COUNT(*) AS totalCount,
            MIN(price) AS minPrice,
            MAX(price) AS maxPrice,
            ROUND(AVG(price), 2) AS avgPrice,
            MIN(record_date) AS firstDate,
            MAX(record_date) AS lastDate
     FROM price_records
     ${whereClause}`,
    params
  );

  res.json({ summary });
});

app.post('/api/records', async (req, res) => {
  const { recordDate, itemName, price, sourceSite, note = '' } = req.body;

  if (!recordDate || !itemName || price === undefined || price === null || !sourceSite) {
    return res.status(400).json({ message: '請填寫日期、商品名稱、商品價格與資料來源網站。' });
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({ message: '商品價格必須是大於 0 的數字。' });
  }

  const created = await db.run(
    `INSERT INTO price_records (record_date, item_name, price, source_site, note)
     VALUES (?, ?, ?, ?, ?)`,
    [recordDate, itemName.trim(), numericPrice, sourceSite.trim(), note.trim()]
  );

  const inserted = await db.get('SELECT * FROM price_records WHERE id = ?', [created.lastID]);
  res.status(201).json({ record: inserted });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function start() {
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  await db.init();
  app.listen(port, () => {
    console.log(`台灣鐵路票價觀察站已啟動：http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('啟動失敗：', error);
  process.exit(1);
});