# OpenSpec 規格紀錄

## 專案名稱
台鐵票價觀察站

## 題目方向
以台灣鐵路票價為主題，觀察交通類商品價格變化，作為通貨膨脹資料展示網站。

## 功能規格

| 項目 | 規格 |
| --- | --- |
| 網站標題 | 台鐵票價觀察站 |
| 新增資料欄位 | 日期、商品名稱、商品價格、資料來源網站、備註 |
| 查詢方式 | 關鍵字、商品名稱、日期區間 |
| 呈現方式 | 表格列出所有票價紀錄 |
| 後端 | Express.js Web API |
| 資料庫 | SQLite |
| 前端 | 單頁式介面、RWD 排版 |

## API 規格

| 方法 | 路徑 | 說明 |
| --- | --- | --- |
| GET | /api/health | 檢查伺服器狀態 |
| GET | /api/records | 查詢票價資料 |
| GET | /api/summary | 查詢統計摘要 |
| POST | /api/records | 新增票價資料 |

## 資料表

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| id | INTEGER | 主鍵 |
| record_date | TEXT | 日期 |
| item_name | TEXT | 商品名稱 |
| price | REAL | 商品價格 |
| source_site | TEXT | 資料來源網站 |
| note | TEXT | 備註 |
| created_at | TEXT | 建立時間 |

## 實作重點

- 使用 Express 提供 REST API
- 使用 SQLite 保存票價紀錄，避免資料散落在前端
- 前端以卡片 + 表格呈現，強調可讀性與查詢效率
- 查詢條件支援日期區間與關鍵字縮小範圍
