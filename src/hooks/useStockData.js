import { useState, useEffect, useCallback } from 'react';
import { fetchWithProxy } from '../utils/api';

// --- Cache helpers (60s TTL) ---
const CACHE_TTL_MS = 60_000;

function loadCache(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const { ts, payload } = JSON.parse(raw);
        if (Date.now() - ts < CACHE_TTL_MS) return payload;
    } catch {}
    return null;
}

function saveCache(key, payload) {
    try {
        localStorage.setItem(key, JSON.stringify({ ts: Date.now(), payload }));
    } catch {}
}

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
    const [marketData, setMarketData] = useState([
        { symbol: "^TWII", name: "台灣加權指數", index: 23500, change: "+150.50", percent: "+0.64%" },
        { symbol: "^TWOII", name: "上櫃指數", index: 320.50, change: "+1.20", percent: "+0.38%" },
        { symbol: "^N225", name: "日經 225", index: 38500, change: "-210.50", percent: "-0.54%" },
        { symbol: "^KS11", name: "韓國綜合", index: 2750, change: "+15.20", percent: "+0.55%" },
    ]);
    const [loading, setLoading] = useState(false);
    const [sheetUrl, setSheetUrl] = useState(() => localStorage.getItem('sheetUrl') || '');
    const [error, setError] = useState(null);
    const [performanceStats, setPerformanceStats] = useState(null);
    const [exchangeRates, setExchangeRates] = useState({});

    useEffect(() => {
        if (sheetUrl) {
            localStorage.setItem('sheetUrl', sheetUrl);
        }
    }, [sheetUrl]);

    // Define fetchData with useCallback so it can be reused
    const fetchData = useCallback(async (isBackground = false) => {
        setError(null);

        if (!isBackground) {
            // Hydrate from cache immediately so the UI shows real data before API responds
            const publicCached = loadCache('stock_public');
            const sheetCached = sheetUrl ? loadCache(`stock_sheet_${sheetUrl}`) : null;
            if (publicCached) {
                setMarketData(publicCached.marketData);
                setExchangeRates(publicCached.exchangeRates);
            }
            if (sheetCached) {
                setData(sheetCached.data);
                setHistoryData(sheetCached.historyData);
                setPerformanceStats(sheetCached.stats);
            }
            // Only show spinner when there's no cached data to display
            const hasFreshCache = publicCached && (!sheetUrl || sheetCached);
            if (!hasFreshCache) setLoading(true);
        }

        // Fetch sheet data and public data (market + rates) in parallel
        await Promise.all([fetchSheetData(), fetchPublicData()]);

        if (!isBackground) setLoading(false);

        async function fetchSheetData() {
        // 1. Fetch Private Data (Google Sheet)
        if (sheetUrl) {
            try {
                const response = await fetch(sheetUrl);
                if (!response.ok) throw new Error('Failed to fetch data');
                const jsonData = await response.json();

                let rawStocks = [];
                let rawHistory = [];
                let rawStats = null; // Initialize rawStats

                if (Array.isArray(jsonData)) {
                    // Legacy support: The whole response is the stocks array
                    rawStocks = jsonData;
                } else if (jsonData && (jsonData.stocks || jsonData.history || jsonData.stats)) {
                    // New format: Object with keys
                    rawStocks = jsonData.stocks || [];
                    rawHistory = jsonData.history || [];
                    rawStats = jsonData.stats || null; // Parse result.stats
                } else {
                    throw new Error('Invalid data format: Expected array or object with stocks/history/stats');
                }

                // --- NEW: Fetch Real-time Quotes for Stocks ---
                const stockMap = {}; // Map symbol -> { price, change, changePercent }
                try {
                    // Extract symbols
                    const symbols = rawStocks.map(s => {
                        let code = s["股票代碼"] || s["代號"];
                        if (!code) return null;
                        code = String(code).trim();
                        // If it looks like a Taiwan stock (4-5 digits, or digits+char, and no dot)
                        // optimize for common cases: 2330, 0050, 00940, 00733B
                        if (!code.includes('.') && /^[0-9A-Z]{4,6}$/.test(code)) {
                            return `${code}.TW`;
                        }
                        return code;
                    }).filter(s => s);

                    const uniqueSymbols = [...new Set(symbols)];

                    if (uniqueSymbols.length > 0) {
                        // Batch fetch failed, so we use Chart API (v8) for each symbol
                        // This endpoint is more reliable but requires one request per stock

                        // Create a map to store results
                        const promises = uniqueSymbols.map(async (symbol) => {
                            try {
                                const timestamp = new Date().getTime();
                                const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d&lang=zh-Hant-TW&region=TW&_t=${timestamp}`;
                                const dataObj = await fetchWithProxy(chartUrl);
                                const result = dataObj.chart?.result?.[0];

                                if (result) {
                                    const meta = result.meta;
                                    const price = Number(meta.regularMarketPrice);
                                    const prevClose = Number(meta.chartPreviousClose || meta.previousClose);
                                    
                                    let name = meta.longName || meta.shortName || symbol;

                                    // Try to get Chinese name via Search API for Taiwan stocks
                                    if (symbol.endsWith('.TW') || symbol.endsWith('.TWO')) {
                                        try {
                                            const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}&lang=zh-Hant-TW&region=TW&quotesCount=1`;
                                            const searchObj = await fetchWithProxy(searchUrl);
                                            const quote = searchObj.quotes?.[0];
                                            if (quote) {
                                                const longHasZh = /[\u4e00-\u9fa5]/.test(quote.longname || '');
                                                const shortHasZh = /[\u4e00-\u9fa5]/.test(quote.shortname || '');
                                                if (longHasZh) name = quote.longname;
                                                else if (shortHasZh) name = quote.shortname;
                                            }
                                        } catch (searchErr) {
                                            console.warn(`Failed to fetch Chinese name for ${symbol}`, searchErr);
                                        }
                                    }

                                    if (!isNaN(price) && !isNaN(prevClose) && prevClose !== 0) {
                                        const change = price - prevClose;
                                        const percent = (change / prevClose) * 100;

                                        const data = {
                                            price,
                                            change,
                                            changePercent: percent,
                                            name: name // Store the fetched name
                                        };

                                        stockMap[symbol] = data;
                                        // Also map without .TW
                                        if (symbol.endsWith('.TW')) {
                                            stockMap[symbol.replace('.TW', '')] = data;
                                        }
                                    }
                                }
                            } catch (e) {
                                console.warn(`Failed to fetch chart for ${symbol}`, e);
                            }
                        });

                        await Promise.all(promises);
                    }
                } catch (qErr) {
                    console.error("Failed to fetch stock quotes:", qErr);
                }

                // Basic normalization to ensure numbers are numbers
                const normalizedData = rawStocks.map(item => {
                    if (!item) return null; // Safety check
                    
                    // Skip empty rows from spreadsheet
                    const hasSymbol = item["股票代碼"] || item["代號"];
                    const hasName = item["股名"] || item["股票名稱"];
                    if (!hasSymbol && !hasName) return null;

                    const quantity = Number(item["股數"]) || 0;

                    // Resolve Symbol
                    let symbol = hasSymbol || "0000";
                    let lookupSymbol = String(symbol).trim();
                    // Match the same logic as above for consistency
                    if (!lookupSymbol.includes('.') && /^[0-9A-Z]{4,6}$/.test(lookupSymbol)) {
                        lookupSymbol += '.TW';
                    }

                    // live data overlap
                    const liveData = stockMap[lookupSymbol];

                    // Determine Price: Live > Sheet > 0
                    const price = liveData?.price
                        ? Number(liveData.price)
                        : (Number(item["股價"]) || 0);

                    // Determine Market Value
                    // If we have live price, Recalculate: Quantity * LivePrice
                    // Otherwise use Sheet's market value
                    const marketValue = liveData?.price
                        ? quantity * price
                        : (Number(item["個股現值"]) || (quantity * price));

                    // Determine Stock Name
                    let sheetName = item["股名"] || item["股票名稱"];
                    if (typeof sheetName === 'string' && (sheetName.includes("找不到") || sheetName === "#N/A" || sheetName === "Loading...")) {
                        sheetName = null; // Ignore errors from sheet formulas
                    }

                    return {
                        ...item,
                        // Internal App Keys mapped from Sheet Columns
                        "股票名稱": sheetName || liveData?.name || "Unknown",
                        "代號": symbol,
                        "股數": quantity,
                        "現價": price,
                        "市值": marketValue,
                        // New Fields for UI
                        "當日漲跌": liveData?.change || 0,
                        "當日漲跌幅": liveData?.changePercent || 0,
                        "isLiveData": !!liveData
                    };
                }).filter(item => item !== null); // Remove nulls


                // Normalize History Data
                const normalizedHistory = rawHistory.map(item => {
                    if (!item) return null;

                    // Handle Date Format (YYYY-MM-DD)
                    let dateStr = "Unknown";
                    const rawDate = item["日期"] || item.date;
                    if (rawDate) {
                        const dateObj = rawDate instanceof Date ? rawDate : new Date(rawDate);
                        if (!isNaN(dateObj.getTime())) {
                            dateStr = dateObj.toLocaleDateString('zh-TW', {
                                timeZone: 'Asia/Taipei',
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).replace(/\//g, '-');
                        }
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
                        annualized: item["年化報酬率"] || item.annualized || "0%",
                        drawdown: Number(item["回撤幅度"] || item.drawdown || 0),
                        sharpe: Number(item["夏普比率"] || item.sharpe || 0),
                        volatility: Number(item["年化波動率"] || item.volatility || 0)
                    };
                }).filter(item => item !== null && item.value > 0);

                setData(normalizedData);
                setHistoryData(normalizedHistory);
                setPerformanceStats(rawStats);
                saveCache(`stock_sheet_${sheetUrl}`, { data: normalizedData, historyData: normalizedHistory, stats: rawStats });
            } catch (err) {
                console.error("Fetch error:", err);
                // Only set error state if it's not a background refresh (to avoid annoying popups)
                if (!isBackground) {
                    setError(err.message);
                }
            }
        }
        } // end fetchSheetData

        // 2. Fetch Public Data (Market Index & Exchange Rates) - runs in parallel with sheet
        async function fetchPublicData() {
        try {
            // Fetch Market Data (Indices) and Exchange Rates in parallel
            const indexSymbols = ['^TWII', '^TWOII', '^N225', '^KS11'];
            const indexNames = ['台灣加權指數', '上櫃指數', '日經 225', '韓國綜合'];
            const currencies = ['USDTWD=X', 'EURTWD=X', 'JPYTWD=X', 'CNYTWD=X'];
            const timestamp = new Date().getTime();

            const fetchResults = await Promise.allSettled([
                ...indexSymbols.map(sym => fetchWithProxy(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=1d&_t=${timestamp}`)),
                ...currencies.map(symbol => fetchWithProxy(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d&_t=${timestamp}`))
            ]);

            const indexResults = fetchResults.slice(0, indexSymbols.length);
            const rateResults = fetchResults.slice(indexSymbols.length);

            // Process Market Indices
            const newMarketData = [];
            indexResults.forEach((settled, idx) => {
                if (settled.status === 'fulfilled') {
                    const result = settled.value.chart?.result?.[0];
                    if (result) {
                        const meta = result.meta;
                        const price = Number(meta.regularMarketPrice);
                        const prevClose = Number(meta.chartPreviousClose || meta.previousClose);
                        if (!isNaN(price) && !isNaN(prevClose) && prevClose !== 0) {
                            const change = price - prevClose;
                            const percent = (change / prevClose) * 100;
                            newMarketData.push({
                                symbol: indexSymbols[idx],
                                name: indexNames[idx],
                                index: price,
                                change: (change >= 0 ? "+" : "") + change.toFixed(2),
                                percent: (percent >= 0 ? "+" : "") + percent.toFixed(2) + "%"
                            });
                        }
                    }
                } else {
                    console.warn(`Failed to fetch index for ${indexSymbols[idx]}:`, settled.reason);
                }
            });

            if (newMarketData.length > 0) {
                setMarketData(newMarketData);
            }

            // Process Exchange Rates
            const ratesData = {};
            rateResults.forEach((settled, i) => {
                if (settled.status === 'fulfilled') {
                    const result = settled.value.chart?.result?.[0];
                    if (result) {
                        const meta = result.meta;
                        const price = Number(meta.regularMarketPrice);
                        const prevClose = Number(meta.chartPreviousClose || meta.previousClose);
                        if (!isNaN(price) && !isNaN(prevClose) && prevClose !== 0) {
                            const change = price - prevClose;
                            const percent = (change / prevClose) * 100;
                            const code = currencies[i].replace('TWD=X', '');
                            ratesData[code] = {
                                price,
                                change: parseFloat(change.toFixed(4)),
                                percent: (percent >= 0 ? "+" : "") + percent.toFixed(2) + "%"
                            };
                        }
                    }
                } else {
                    console.warn(`Failed to fetch rate for ${currencies[i]}:`, settled.reason);
                }
            });
            if (Object.keys(ratesData).length > 0) {
                setExchangeRates(ratesData);
            }

            // Persist to cache for next page load
            if (newMarketData.length > 0 && Object.keys(ratesData).length > 0) {
                saveCache('stock_public', { marketData: newMarketData, exchangeRates: ratesData });
            }
        } catch (publicErr) {
            console.error("Public data fetch error:", publicErr);
        }
        } // end fetchPublicData
    }, [sheetUrl]);

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

    return {
        data,
        historyData,
        performanceStats,
        marketData,
        exchangeRates,
        loading,
        error,
        sheetUrl,
        setSheetUrl,
        totalValue: data.reduce((acc, stock) => acc + (stock.市值 || 0), 0),
        refresh: () => fetchData(false)
    };
};
