# 台鐵票價觀察站實作報告

## 基本資料
- 姓名：請填入你的姓名
- 班級：請填入你的班級
- 網站標題：台鐵票價觀察站

## 一、主題說明
本專題以台灣鐵路票價為觀察主題，利用日期、商品名稱與價格紀錄來呈現票價變化。台鐵屬於大眾交通運輸，和日常通勤、跨縣市移動以及民生支出都有直接關聯，因此很適合作為通貨膨脹與生活成本的觀察案例。

選擇這個主題的原因是，台鐵票價變動的資訊相對容易查詢，也能清楚對照調整前後的價格差異。比起一般零食或單次消費商品，交通票價更能反映長期、穩定且具代表性的生活成本變化。

## 二、商品特色與資料來源

### 商品特色
- 與民生消費高度相關
- 有明確的官方查詢來源
- 票價調整前後差異明顯，便於比較
- 適合用表格方式呈現歷史價格紀錄
- 能作為通貨膨脹觀察的簡易資料案例

### 資料來源
- 參考文章：<https://www.cashfeel.com.tw/article/%E5%8F%B0%E9%90%B5%E6%BC%B2%E5%83%B9-%E7%A5%A8%E5%83%B9%E6%9F%A5%E8%A9%A2>
- 台鐵官方票價試算與車次查詢頁面

## 三、系統規格

| 項目 | 說明 |
| --- | --- |
| 網站標題 | 台鐵票價觀察站 |
| 前端技術 | HTML / CSS / JavaScript |
| 後端技術 | Express.js Web API |
| 資料庫 | SQLite |
| 主要欄位 | 日期、商品名稱、商品價格、資料來源網站、備註 |
| 查詢功能 | 關鍵字、商品名稱、日期區間 |
| 呈現方式 | 表格列出物價歷史紀錄 |

## 四、實作流程
1. 確認主題與資料欄位。
2. 建立 Express 後端與 SQLite 資料表。
3. 設計前端表單、查詢條件與資料列表。
4. 使用 fetch 串接 API 進行新增與查詢。
5. 製作 OpenSpec 規格與實作紀錄。
6. 整理文件並準備上傳 GitHub。

## 五、功能介紹

### 1. 新增資料
使用者可輸入日期、商品名稱、商品價格、資料來源網站與備註，送出後會透過後端 API 寫入 SQLite。

### 2. 查詢資料
可透過關鍵字、商品名稱與日期區間縮小搜尋範圍，並以表格方式顯示歷史資料。

### 3. 統計摘要
畫面中提供總筆數、最低價格、最高價格與平均價格，方便快速了解目前資料狀況。

## 六、關鍵程式碼

### 前端送出資料
```javascript
const response = await fetch('/api/records', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
});
```
說明：前端使用 fetch 將表單資料送到後端，完成新增紀錄。

### 後端接收並寫入資料庫
```javascript
app.post('/api/records', async (req, res) => {
  const { recordDate, itemName, price, sourceSite, note = '' } = req.body;
  const created = await db.run(
    `INSERT INTO price_records (record_date, item_name, price, source_site, note)
     VALUES (?, ?, ?, ?, ?)`,
    [recordDate, itemName.trim(), Number(price), sourceSite.trim(), note.trim()]
  );
```
說明：後端先驗證資料，再寫入 SQLite，確保重新整理後資料仍可保留。

### 資料表建立
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
說明：SQLite 資料表在第一次啟動時建立，後續可直接使用同一份資料。

## 七、localhost 執行流程
1. 安裝套件：npm install
2. 啟動專案：npm start
3. 開啟瀏覽器進入 http://localhost:3000
4. 輸入日期、商品名稱、商品價格與資料來源網站
5. 使用查詢條件查看歷史資料

## 八、畫面截圖

請將下列三張截圖放入文件中對應位置，讓報告更完整。

### 圖 1：啟動成功首頁畫面
![啟動成功首頁畫面](images/01-首頁畫面.png)

### 圖 2：新增資料畫面
![新增資料畫面](images/02-新增資料成功.png)

### 圖 3：查詢結果畫面
![查詢結果畫面](images/03-查詢結果.png)

## 九、心得與結論
本專題成功將台鐵票價整理成可查詢的資料網站，讓使用者可以透過表格直接比較不同日期的價格變化。透過 Express、SQLite 與原生前端的搭配，可以完成一個簡單但完整的資料記錄系統。

如果未來要繼續延伸，可以加入更多票種、更多路線，或進一步加入自動抓取票價的功能，讓資料更新更便利。

## 十、作業檢查清單對照
- A1：可透過 npm install 與 npm start 啟動。
- A2：網站標題已設定為台鐵票價觀察站。
- A3：提供日期、商品名稱、商品價格輸入欄位。
- A4：資料寫入 SQLite，重新整理後仍存在。
- A5：可用表格呈現物價歷史紀錄。
- A6：已提供至少 3 筆以上示範資料。
- B1：前端使用 HTML/CSS/JavaScript。
- B2：後端使用 Express.js Web API。
- B3：資料庫使用 SQLite。
- B4：前端透過 fetch 呼叫後端 API。
- C1：專案已上傳 GitHub。
- C2：已使用 .gitignore 排除 node_modules。
- C3：包含完整 package.json。
- C4：GitHub repo 可公開或透過連結瀏覽。
- D1：文件可貼到 HackMD 或 Notion，並開啟分享權限。
- D2：文件包含商品介紹與選擇理由。
- D3：文件保留三張 localhost 截圖位置。
- D4：文件包含前端、後端、資料庫程式碼片段。
- D5：文件可作為教學說明參考。

## 十一、提交提醒
1. 請把上方「姓名」與「班級」改成你的真實資料。
2. 請把三張截圖補進文件。
3. 確認 GitHub repo 設為公開，或至少可用連結瀏覽。