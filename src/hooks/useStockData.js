import { useState, useEffect, useCallback } from 'react';

// Mock Data
const MOCK_DATA = [
    { "股票名稱": "台積電", "代號": "2330.TW", "股數": 1000, "現價": 620, "市值": 620000 },
    { "股票名稱": "鴻海", "代號": "2317.TW", "股數": 2000, "現價": 105, "市值": 210000 },
    { "股票名稱": "聯發科", "代號": "2454.TW", "股數": 500, "現價": 980, "市值": 490000 },
    { "股票名稱": "NVIDIA", "代號": "NVDA", "股數": 50, "現價": 550, "市值": 852500 },
];

const MOCK_HISTORY = [
    { date: "2024-01-01", value: 2000000, dailyGrow: "+1.2%", totalGrow: "+0%", annualized: "0%" },
    { date: "2024-02-01", value: 2150000, dailyGrow: "+0.8%", totalGrow: "+7.5%", annualized: "7.5%" },
    { date: "2024-03-01", value: 2300000, dailyGrow: "+1.5%", totalGrow: "+15%", annualized: "15%" },
    { date: "2024-04-01", value: 2280000, dailyGrow: "-0.9%", totalGrow: "+14%", annualized: "14%" },
    { date: "2024-05-01", value: 2450000, dailyGrow: "+2.1%", totalGrow: "+22.5%", annualized: "22.5%" },
];

export const useStockData = () => {
    const [data, setData] = useState(MOCK_DATA);
    const [historyData, setHistoryData] = useState(MOCK_HISTORY);
    const [marketData, setMarketData] = useState({ name: "台股加權", index: 23500, change: "+150.5", percent: "+0.64%" });
    const [loading, setLoading] = useState(false);
    const [sheetUrl, setSheetUrl] = useState(() => localStorage.getItem('sheetUrl') || '');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (sheetUrl) {
            localStorage.setItem('sheetUrl', sheetUrl);
        }
    }, [sheetUrl]);

    // Define fetchData with useCallback so it can be reused
    const fetchData = useCallback(async (isBackground = false) => {
        if (!sheetUrl) return;

        // Only show full loading state if not a background refresh
        if (!isBackground) setLoading(true);

        setError(null);
        try {
            const response = await fetch(sheetUrl);
            if (!response.ok) throw new Error('Failed to fetch data');
            const jsonData = await response.json();

            let rawStocks = [];
            let rawHistory = [];
            let rawMarket = [];

            if (Array.isArray(jsonData)) {
                // Legacy support: The whole response is the stocks array
                rawStocks = jsonData;
            } else if (jsonData && (jsonData.stocks || jsonData.history)) {
                // New format: Object with keys
                rawStocks = jsonData.stocks || [];
                rawHistory = jsonData.history || [];
            } else {
                throw new Error('Invalid data format: Expected array or object with stocks/history');
            }

            // Fetch Market Data (TAIEX) Directly from Yahoo Finance via Proxy
            try {
                const proxyUrl = 'https://api.allorigins.win/get?url=';
                const targetUrl = encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/^TWII?interval=1d&range=1d');
                const marketRes = await fetch(`${proxyUrl}${targetUrl}`);
                const marketJson = await marketRes.json();
                const marketDataObj = JSON.parse(marketJson.contents);
                const result = marketDataObj.chart?.result?.[0];
                if (result) {
                    const meta = result.meta;
                    const price = meta.regularMarketPrice;
                    const prevClose = meta.previousClose;
                    const change = price - prevClose;
                    const percent = (change / prevClose) * 100;

                    setMarketData({
                        name: "台股加權",
                        index: price,
                        change: (change >= 0 ? "+" : "") + change.toFixed(2),
                        percent: (percent >= 0 ? "+" : "") + percent.toFixed(2) + "%"
                    });
                }
            } catch (mErr) {
                console.error("Market fetch error:", mErr);
            }

            // Basic normalization to ensure numbers are numbers
            const normalizedData = rawStocks.map(item => {
                if (!item) return null; // Safety check
                const quantity = Number(item["股數"]) || 0;
                const price = Number(item["股價"]) || 0; // User column: 股價
                const marketValue = Number(item["個股現值"]) || (quantity * price); // User column: 個股現值

                return {
                    ...item,
                    // Internal App Keys mapped from Sheet Columns
                    "股票名稱": item["股名"] || item["股票名稱"] || "Unknown", // User column: 股名
                    "代號": item["股票代碼"] || item["代號"] || "0000", // User column: 股票代碼
                    "股數": quantity,
                    "現價": price,
                    "市值": marketValue,
                };
            }).filter(item => item !== null); // Remove nulls


            // Normalize History Data
            const normalizedHistory = rawHistory.map(item => {
                if (!item) return null;

                // Handle Date Format (YYYY-MM-DD)
                let dateStr = "Unknown";
                const rawDate = item["日期"] || item.date;
                if (rawDate instanceof Date) {
                    dateStr = rawDate.toISOString().split('T')[0];
                } else if (typeof rawDate === 'string') {
                    dateStr = rawDate.split('T')[0];
                }

                // Handle Growth Percentage
                let totalGrowStr = "0%";
                const rawGrow = item["累積成長"] || item.totalGrow;
                if (typeof rawGrow === 'number') {
                    // Assuming number like 0.15 for 15%
                    totalGrowStr = `${(rawGrow * 100).toFixed(2)}%`;
                } else if (rawGrow) {
                    totalGrowStr = String(rawGrow);
                }

                return {
                    date: dateStr,
                    value: Number(item["總值"]) || Number(item.value) || 0,
                    dailyGrow: item["當日成長"] || item.dailyGrow || "0%",
                    totalGrow: totalGrowStr,
                    annualized: item["年化報酬率"] || item.annualized || "0%"
                };
            }).filter(item => item !== null && item.value > 0);

            setData(normalizedData);
            setHistoryData(normalizedHistory);
        } catch (err) {
            console.error("Fetch error:", err);
            // Only set error state if it's not a background refresh (to avoid annoying popups)
            if (!isBackground) {
                setError(err.message);
            }
        } finally {
            if (!isBackground) setLoading(false);
        }
    }, [sheetUrl]); // Removed data dependency to avoid infinite loop

    useEffect(() => {
        // Initial fetch
        fetchData(false);

        // Set up polling every 60 seconds
        const intervalId = setInterval(() => {
            fetchData(true);
        }, 60000);

        // Cleanup interval on unmount or when sheetUrl changes
        return () => clearInterval(intervalId);
    }, [fetchData]);

    const totalValue = data.reduce((acc, curr) => acc + curr.市值, 0);

    return { data, historyData, marketData, loading, error, sheetUrl, setSheetUrl, totalValue, refresh: () => fetchData(false) };
};
