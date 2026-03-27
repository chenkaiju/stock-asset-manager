# 專案任務計畫

> 規則：
> - 規劃角色負責新增任務（- [ ]）
> - 實作角色負責勾選完成（- [x]）並移至已完成區塊
> - 進行中超過 10 項時請封存

## 進行中

（空）

## 已完成

- [x] 替換字型：將 M PLUS Rounded 1c 改為 Noto Serif TC（繁體中文明體），更新 index.css 的 @import 與 --font-family 變數，確認各元件標題 / body 字重對應（Display 用 700、Label / Body 用 400）

- [x] 建立 CSS 設計變數系統：color tokens（surface 層級、primary、tertiary）、spacing、radius（16px sm / 32px lg / 24px btn / 999px pill）
- [x] 引入 M PLUS Rounded 1c 字體（Google Fonts），設定 Typography Scale（Display-LG 800/3.5rem 到 Label-MD 800/0.75rem）
- [x] 重寫 index.css 全域樣式：cream 底色 #FEFCF1、on-surface 文字 #383831、移除所有 1px solid border、設定 ambient shadow utility class
- [x] 重設計 Header 元件：移除硬線邊框、套用 surface-container-low 背景、標題使用 Display-LG 字體 weight 800
- [x] 重設計 Dashboard 佈局：非對稱卡片排版（intentional asymmetry）、卡片間距用 spacing gap 取代 divider、卡片使用 32px radius + ambient shadow
- [x] 重設計 StockList 元件：移除所有列表分隔線、改用 1.4rem vertical gap、每組股票包在 32px radius container（surface-container-low）
- [x] 重設計 PerformanceStats 元件：數據卡片使用 tonal stacking（#FFFFFF card on #FBFAEE container）、無 border、ambient shadow
- [x] 重設計 ExchangeRates 元件：同 PerformanceStats 卡片風格、無分隔線
- [x] 重設計 MacroInsights 元件：卡片群組用 surface-container-low 包裹、內部 tag 使用 surface-container-high (#F0EEE1)
- [x] 重設計 DataSource 元件：輸入欄位改為 pill-shape（999px radius）、無 border、focus halo 用 primary_fixed 30% opacity
- [x] 重設計 Sidebar 元件：套用 Glassmorphism（surface 80% opacity + backdrop-blur 20px）
- [x] 重設計 Button 樣式：primary 按鈕 24px radius + primary_fixed 到 primary 135° 漸層、hover squish（scale 0.98）
- [x] 重設計 HistoryChart 元件：圖表容器套用 32px radius 卡片、線條色使用 primary_fixed (#F9CC61)
