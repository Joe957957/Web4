# 台鐵票價觀察站實作說明

## 基本資料
- 姓名：請填入你的姓名（範例：王小明）
- 班級：請填入你的班級（範例：資訊三甲）
- 網站標題：台鐵票價觀察站

## 主題介紹
我選擇台灣鐵路票價作為主題，因為交通支出是最直接反映生活成本的項目之一。台鐵票價和民眾日常通勤、跨縣市移動息息相關，因此適合拿來觀察價格變化與通貨膨脹趨勢。

## 商品特色
- 與民生消費高度相關
- 容易透過官方網站或新聞公告查詢
- 適合用日期與價格表格呈現變化
- 具有明確的查詢需求，可做成簡易資料管理網站
- 票價調整前後差異明確，適合拿來做通貨膨脹觀察

## 資料來源
- 參考文章：<https://www.cashfeel.com.tw/article/%E5%8F%B0%E9%90%B5%E6%BC%B2%E5%83%B9-%E7%A5%A8%E5%83%B9%E6%9F%A5%E8%A9%A2>
- 票價查詢參考：台鐵官方票價試算與車次查詢頁面

## 為什麼選這類型商品
我選擇台鐵票價，是因為它不像單一零食那樣只是短期商品，而是長期且固定會被大家使用的交通費用。當票價發生變動時，大家會直接感受到生活成本變化，這很適合拿來做通貨膨脹觀察。

## Spec 規格表

| 項目 | 說明 |
| --- | --- |
| 網站標題 | 台鐵票價觀察站 |
| 新增資料欄位 | 日期、商品名稱、商品價格、資料來源網站、備註 |
| 查詢功能 | 關鍵字、商品名稱、日期區間 |
| 前端 | 單頁式網站 |
| 後端 | Express.js Web API |
| 資料庫 | SQLite |

## 實作流程
1. 先確認主題與資料欄位
2. 建立 Express 後端與 SQLite 資料表
3. 設計前端表單與查詢頁面
4. 串接 API 讀寫資料
5. 用 OpenSpec 紀錄規格與實作過程
6. 將專案上傳 GitHub

## 關鍵程式碼片段

### 前端串接 API
```javascript
const response = await fetch('/api/records', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
});
```
說明：前端用 `fetch` 把日期、商品名稱、價格與來源送到後端，完成資料寫入。

### 後端新增資料
```javascript
app.post('/api/records', async (req, res) => {
  const { recordDate, itemName, price, sourceSite, note = '' } = req.body;
  const created = await db.run(
    `INSERT INTO price_records (record_date, item_name, price, source_site, note)
     VALUES (?, ?, ?, ?, ?)`,
    [recordDate, itemName.trim(), Number(price), sourceSite.trim(), note.trim()]
  );
```
說明：Express 先驗證資料，再寫入 SQLite，確保重新整理後資料仍存在。

### 資料庫初始化
```javascript
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
```
說明：SQLite 在第一次啟動時建立資料表，之後直接沿用同一份資料。

## localhost 執行流程
1. 安裝套件：`npm install`
2. 啟動專案：`npm start`
3. 開啟瀏覽器進入 `http://localhost:3000`
4. 在新增表單輸入日期、商品名稱、價格與資料來源
5. 使用查詢欄位篩選不同條件
6. 建議測試流程（截圖步驟）

  - 啟動伺服器後截圖首頁（含表單與表格）
  - 新增一筆票價紀錄，截圖填寫表單與送出後的成功提示
  - 使用查詢條件（例如商品名稱或日期區間），截圖查詢結果表格

### 如何取得截圖（Windows）

```powershell
# 啟動伺服器
npm install
npm start

# 開啟瀏覽器並截圖（手動按 PrintScreen 或使用 Win+Shift+S）
```

將截圖上傳到 HackMD/Notion 文件中對應位置。

## 截圖區
- 圖 1：啟動成功首頁畫面
- 圖 2：輸入日期、商品名稱、價格與來源後的表單畫面
- 圖 3：按下查詢後的表格結果畫面

### 截圖佔位（貼到 HackMD / Notion）

請將下列三張截圖上傳到你使用的雲端文件，並在對應位置貼上圖片：

- 啟動成功首頁畫面：

  ![啟動成功首頁畫面](images/screenshot-start.png)

- 新增紀錄表單（含填寫內容）：

  ![新增紀錄表單](images/screenshot-form.png)

- 查詢結果表格：

  ![查詢結果表格](images/screenshot-results.png)

（提示：在 HackMD 中可直接拖放圖片，或上傳到 GitHub repo 的 `docs/images/` 再引用。）

### 填寫你的姓名與班級

請編輯上方「基本資料」欄位，把範例名稱改為你的真實姓名與班級，範例如下：

- 姓名：王小明
- 班級：資訊三甲


## GitHub 上傳指令（範例）

請先在本機建立 remote repo（或由老師給予 repo 連結），再執行以下範例指令：

```bash
git init
git add .
git commit -m "初始提交：台鐵票價觀察站"
git branch -M main
# 以下以你自己的 remote URL 代替 <YOUR_REMOTE_URL>
git remote add origin <YOUR_REMOTE_URL>
git push -u origin main
```

注意：如果使用 GitHub CLI 或要建立 repo，可參考 `gh repo create`。

## 作業檢查清單對照（快速核對）

- A1：請在本機執行 `npm install` 與 `npm start`，若頁面載入且無錯誤即符合。
- A2：本專案已將網站標題設為「台鐵票價觀察站」。
- A3：前端表單包含 `日期`、`商品名稱`、`商品價格` 三欄位。
- A4：資料寫入 SQLite，重新整理後資料仍存在（資料庫檔案位於 `data/rail_fares.sqlite3`）。
- A5：下方表格會顯示所有已輸入的票價歷史紀錄。
- A6：已在 `db.js` 種入多筆示範資料，至少 3 筆以供展示。

- B1：前端為純 HTML/CSS/JavaScript（無框架）。
- B2：後端使用 Express.js（見 `server.js`）。
- B3：資料庫為 SQLite（見 `db.js`）。
- B4：前端透過 `fetch` 呼叫後端 API（見 `public/app.js`）。

- C1：請將整個專案上傳至 GitHub（本工具無法直接替你上傳）。
- C2：已包含 `.gitignore` 排除 `node_modules/` 與 `data/`。
- C3：`package.json` 已包含必要相依套件。
- C4：請將 GitHub repo 設為公開或提供連結供評分人檢視。

- D1：請把 `docs/hackmd-template.md` 內容貼到 HackMD/Notion 並開啟分享權限。
- D2：文件中已包含商品介紹與選擇理由（請填入姓名與班級）。
- D3：請依照截圖區步驟補上至少 3 張 localhost 畫面截圖。
- D4：文件內含前端、後端、資料庫三處程式碼片段與說明。
- D5：文件內容已以教學方式撰寫，其他人可依此重現專案。

- E1/E2（加分）：如需我可示範爬蟲或協助部署，請告知。

## 需要我幫忙的項目（選填）

1. 幫你把專案推上 GitHub（需你提供 remote repo 或授權）。
2. 將 `docs/hackmd-template.md` 轉成最正式的報告版（代填姓名/班級與截圖位置）。
3. 加上部署流程（Render/Azure）或爬蟲功能示範。

請告訴我要先做哪一項。

## 畫面說明
- 首頁上方是網站標題與主題說明
- 左側區塊可新增票價紀錄
- 右側區塊可查詢與查看摘要統計
- 下方表格會顯示所有票價變化紀錄

## 上傳 GitHub 提醒
如果老師要求「先上傳 GitHub」，可以在完成本機專案後建立新的 GitHub repository，再把整個專案推上去。