# 專案移交與開發指南 (Handover Guide)

這份文件旨在協助您在不同設備（如家裡電腦）接續開發此專案，並讓新的 AI 助理能快速進入狀況。

## 🚀 快速啟動
1.  **複製專案**：使用 Git 下載您的 GitHub 儲存庫。
2.  **安裝依賴**：`npm install`
3.  **啟動開發**：`npm run dev`
4.  **連結後端**：在網頁的 **「資料來源」** 頁面貼上您的 Google Apps Script Web App URL。

---

## 🏗️ 系統架構與技術決策
-   **前端**：React + Vite + Tailwind CSS。
-   **後端 (GAS)**：Google Apps Script 作為資料中繼站，將試算表轉為 JSON API。
-   **市場與匯率數據**：不經過 GAS，前端透過 `api.allorigins.win` 代理直接從 Yahoo Finance 抓取：
    -   台股加權指數 (TAIEX)
    -   匯率：USD/TWD, EUR/TWD, JPY/TWD, CNY/TWD
-   **視覺風格**：
    -   遵循**台灣市場配色**（紅漲、綠跌）。
    -   深色模式設計，使用玻璃擬物化 (Glassmorphism) 效果。
-   **時區處理**：全系統強制使用 **台灣時間 (Asia/Taipei)** 計算日期與漲跌，避免 UTC 誤差。

---

## 📊 試算表結構要求 (重要)
為確保「趨勢分析」與「績效分析」正常運作，您的 Google Sheet **「歷史現值」** 工作表必須包含以下表頭（名稱需完全一致）：
-   `日期`、`總值`、`累積成長`
-   `回撤幅度`、`夏普比率`、`年化波動率`
-   `年化報酬率`、`索提諾比率`、`Calmar Ratio`、`最大回撤 (MDD)` (注意：舊版欄位可能已被隱藏或移除，請確保後端 Code.js 對應正確)

---

## 📝 當前進度與 AI 上下文 (Memory Sync)
如果您在另一台電腦使用 AI 助理開發，請直接將此段落或本文件提供給 AI：

### **已完成功能 (Completed)**
1.  **Dashboard**：總資產概覽、今日漲跌（與昨日歷史數據比較，修正時區問題）。
2.  **匯率資訊 (Exchange Rates)**：[NEW] 顯示 USD, EUR, JPY, CNY 兌台幣即時匯率（含防快取機制）。
3.  **持股清單 (Stock List)**：[NEW] 支援點擊標題依照代碼、名稱、股數、股價、市值排序。
4.  **趨勢分析 (Trend Analysis)**：資產走勢、Drawdown、Sharp/Volatility 圖表。
5.  **績效分析 (Performance)**：[UPDATED] 精簡化介面，移除圖示，優化字體大小與數值顯示。
6.  **資料來源頁面**：獨立管理 GAS 連線（已移至選單最下方）。

### **最近變更 (Recent Changes)**
-   **Feat**: 新增匯率頁面，使用 Yahoo Finance Proxy 抓取並支援個別錯誤處理。
-   **Feat**: 實作持股清單多欄位排序功能。
-   **Fix**: 修正前後端日期計算邏輯，統一轉為 Asia/Taipei 格式，解決每日變化計算錯誤。
-   **Style**: 移除績效分析卡片圖示，調整字級層級 (Title大/Value小)。

### **待辦事項 (Pending/Next Steps)**
-   目前沒有待辦事項。

---

## 🛠️ 維護紀錄
-   修正了 `Icons.Info` 缺失導致的渲染崩潰。
-   優化了 TAIEX 數據抓取邏輯，解決 `NaN` 錯誤。
-   將夏普比率改為數值顯示（非百分比）。
-   後端 `Code.js` 需確保回傳日期已格式化為 "yyyy-MM-dd" 字串。
