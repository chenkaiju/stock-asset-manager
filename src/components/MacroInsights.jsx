import React, { useState, useEffect } from 'react';
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Legend } from 'recharts';
import { Icons } from './Icons';
import { fetchWithProxy } from '../utils/api';

export const MacroInsights = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_FRED_API_KEY || '');

    useEffect(() => {
        const loadData = async () => {
            if (!apiKey) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // 1. Fetch S&P 500 (Yahoo Finance) - Daily
                // Fetching 5 years of daily data
                const sp500Url = 'https://query1.finance.yahoo.com/v8/finance/chart/^GSPC?interval=1d&range=5y';
                const sp500Res = await fetchWithProxy(sp500Url);
                const sp500Result = sp500Res.chart?.result?.[0];

                if (!sp500Result) throw new Error('Failed to load S&P 500 data');

                const sp500Quotes = sp500Result.indicators.quote[0];
                const sp500Timestamps = sp500Result.timestamp;

                // Create a Map for S&P 500 data for easy lookup by date string (YYYY-MM-DD)
                const sp500Map = new Map();
                sp500Timestamps.forEach((ts, index) => {
                    const date = new Date(ts * 1000).toISOString().split('T')[0];
                    if (sp500Quotes.close[index]) {
                        sp500Map.set(date, sp500Quotes.close[index]);
                    }
                });


                // 2. Fetch M2 (FRED) - Monthly
                // API URL: https://api.stlouisfed.org/fred/series/observations
                // Need to use proxy to avoid CORS
                const m2Url = `https://api.stlouisfed.org/fred/series/observations?series_id=M2SL&api_key=${apiKey}&file_type=json&observation_start=${new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split('T')[0]}`;
                const m2Res = await fetchWithProxy(m2Url);

                if (!m2Res.observations) throw new Error('Failed to load M2 data (Check API Key)');

                // 3. Merge Data
                // Strategy: Use M2 dates (monthly) as the base, and find the closest S&P 500 value
                // Or: Use all S&P 500 dates and interpolate M2? 
                // Better visualization: Use all S&P 500 dates (daily) and fill M2 forward (since it's monthly stock)

                const mergedData = [];
                let lastM2 = null;

                // Convert M2 observations to a Map for lookup
                const m2Map = new Map();
                m2Res.observations.forEach(obs => {
                    m2Map.set(obs.date, parseFloat(obs.value));
                });

                // Helper to get closest sorted date in M2 for a given SP500 date (naive forward fill)
                // Actually, let's just iterate through SP500 dates and see if there's a new M2 value, otherwise hold previous.
                // But M2 dates are "2023-01-01", SP500 are trading days.

                // Improved Strategy: Combine all unique dates from both sets, sort them.
                const allDates = new Set([...sp500Map.keys(), ...m2Map.keys()]);
                const sortedDates = Array.from(allDates).sort();

                let currentM2 = null;
                let currentSP500 = null;

                sortedDates.forEach(date => {
                    if (m2Map.has(date)) currentM2 = m2Map.get(date);
                    if (sp500Map.has(date)) currentSP500 = sp500Map.get(date);

                    if (currentM2 !== null && currentSP500 !== null) {
                        mergedData.push({
                            date,
                            displayDate: date, // Simplify for chart
                            sp500: currentSP500,
                            m2: currentM2,
                            timestamp: new Date(date).getTime()
                        });
                    }
                });

                setData(mergedData);

            } catch (err) {
                console.error("Macro data error:", err);
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [apiKey]);


    if (!apiKey) {
        return (
            <div className="flex flex-col items-center justify-center h-96 p-8 text-center space-y-4">
                <div className="p-4 bg-yellow-500/10 rounded-full text-yellow-500 mb-2">
                    <Icons.Key size={48} />
                </div>
                <h2 className="text-2xl font-bold text-white">需要 FRED API Key</h2>
                <p className="text-neutral-400 max-w-md">
                    為了顯示 M2 貨幣供給數據，請確認您的環境變數 (Environment Variables) 中已設定 API Key。
                </p>
                <div className="bg-neutral-900 p-4 rounded-xl border border-white/10 text-left w-full max-w-md">
                    <p className="text-xs text-neutral-500 mb-2 font-mono">.env</p>
                    <code className="text-sm text-green-400 font-mono break-all">
                        VITE_FRED_API_KEY=abcdef123456...
                    </code>
                </div>
                <p className="text-xs text-neutral-500">
                    如果您是在 Vercel 部署，請至 Settings &gt; Environment Variables 新增。
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Icons.RefreshCw className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-red-400">
                <Icons.AlertTriangle size={48} className="mb-4" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">總經觀察</h1>
                    <p className="text-neutral-500 mt-1">S&P 500 vs. M2 Money Supply</p>
                </div>
            </header>

            <div className="bg-neutral-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
                <div className="h-[500px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data}>
                            <defs>
                                <linearGradient id="colorSp500" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="timestamp"
                                type="number"
                                scale="time"
                                domain={['dataMin', 'dataMax']}
                                tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
                                stroke="#525252"
                                tick={{ fill: '#737373', fontSize: 12 }}
                            />
                            <YAxis
                                yAxisId="left"
                                stroke="#3b82f6"
                                tick={{ fill: '#3b82f6', fontSize: 12 }}
                                domain={['auto', 'auto']}
                                tickFormatter={(val) => Math.round(val).toLocaleString()}
                                label={{ value: 'S&P 500', angle: -90, position: 'insideLeft', fill: '#3b82f6' }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#10b981"
                                tick={{ fill: '#10b981', fontSize: 12 }}
                                domain={['auto', 'auto']}
                                tickFormatter={(val) => (val / 1000).toFixed(1) + 'T'}
                                label={{ value: 'M2 (Billions)', angle: 90, position: 'insideRight', fill: '#10b981' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                formatter={(value, name) => [
                                    name === 'sp500' ? Math.round(value).toLocaleString() : value.toLocaleString(),
                                    name === 'sp500' ? 'S&P 500' : 'M2 Supply'
                                ]}
                            />
                            <Legend />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="sp500"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorSp500)"
                                name="S&P 500"
                                dot={false}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="m2"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={false}
                                name="M2 Supply"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 text-xs text-neutral-500 text-center">
                    Data Sources: Yahoo Finance (S&P 500), FRED (M2 Money Stock)
                </div>
            </div>
        </div>
    );
};
