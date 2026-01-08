import { useState, useEffect } from 'react';

// Mock Data
const MOCK_DATA = [
    { "股票名稱": "台積電", "代號": "2330.TW", "股數": 1000, "現價": 620, "市值": 620000 },
    { "股票名稱": "鴻海", "代號": "2317.TW", "股數": 2000, "現價": 105, "市值": 210000 },
    { "股票名稱": "聯發科", "代號": "2454.TW", "股數": 500, "現價": 980, "市值": 490000 },
    { "股票名稱": "NVIDIA", "代號": "NVDA", "股數": 50, "現價": 550, "市值": 852500 },
];

export const useStockData = () => {
    const [data, setData] = useState(MOCK_DATA);
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

            // Basic normalization to ensure numbers are numbers
            const normalizedData = jsonData.map(item => {
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
            });

            setData(normalizedData);
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

    return { data, loading, error, sheetUrl, setSheetUrl, totalValue, refresh: () => fetchData(false) };
};
