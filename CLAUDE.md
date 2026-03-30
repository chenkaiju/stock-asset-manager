# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Vite HMR)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

No test suite is configured.

## Architecture

A personal stock/asset portfolio dashboard — a React 19 SPA deployed on Vercel, with a Google Apps Script backend serving data from Google Sheets.

### Data Flow

```
Google Sheets → Google Apps Script (doGet) → useStockData hook
Yahoo Finance (prices/rates) → CORS Proxy → useStockData hook
FRED API (macro data) → CORS Proxy → MacroInsights component
```

All data fetching is centralized in `src/hooks/useStockData.js`, which polls every 60 seconds. The hook returns `{ data, historyData, performanceStats, marketData, exchangeRates, loading, error, sheetUrl, setSheetUrl, totalValue, refresh }`.

### CORS Proxy Strategy

Yahoo Finance blocks direct browser requests. Three-layer fallback in `src/utils/api.js`:
1. Self-hosted Vercel serverless proxy (`/api/proxy.js`) — primary
2. `corsproxy.io` — fallback
3. `allorigins.win` — last resort

The Vite dev server also intercepts `/api/proxy` via custom middleware in `vite.config.js`.

### Backend

`backend/Code.js` is a Google Apps Script deployed as a Web App. It reads two sheets:
- **現值** — current stock holdings
- **歷史現值** — portfolio history

The user configures their own Google Sheet URL via the DataSource tab, stored in `localStorage`.

### Key Conventions

- **Taiwan-centric**: Dates use `Asia/Taipei` timezone; market color convention is red=up, green=down (台灣慣例: 紅漲綠跌)
- **Symbol normalization**: Taiwan stocks automatically get `.TW` suffix appended for Yahoo Finance lookups
- **Environment**: `VITE_FRED_API_KEY` is required for macro insights (FRED API)
- The Vercel proxy whitelists only: `query1.finance.yahoo.com`, `query2.finance.yahoo.com`, `api.stlouisfed.org`
- **Mock data**: `useStockData.js` initializes with hardcoded mock stocks/history so the UI renders without a configured sheet URL
- **Google Sheets column headers are in Chinese**: `股票名稱` (name), `代號` (ticker), `股數` (shares), `現價` (price), `市值` (market value)
