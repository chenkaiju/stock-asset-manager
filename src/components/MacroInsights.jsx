import React, { useState, useEffect } from 'react';
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Legend } from 'recharts';
import { Icons } from './Icons';
import { fetchWithProxy } from '../utils/api';

export const MacroInsights = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiKey] = useState(import.meta.env.VITE_FRED_API_KEY || '');

    useEffect(() => {
        const loadData = async () => {
            if (!apiKey) { setLoading(false); return; }

            const CACHE_KEY = 'macroData_v1';
            const CACHE_DURATION = 24 * 60 * 60 * 1000;
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                try {
                    const { timestamp, data: cachedData } = JSON.parse(cached);
                    if (Date.now() - timestamp < CACHE_DURATION && cachedData.length > 0) {
                        setData(cachedData); setLoading(false); return;
                    }
                } catch { localStorage.removeItem(CACHE_KEY); }
            }

            setLoading(true); setError(null);
            try {
                const sp500Res = await fetchWithProxy('https://query1.finance.yahoo.com/v8/finance/chart/^GSPC?interval=1d&range=5y');
                const sp500Result = sp500Res.chart?.result?.[0];
                if (!sp500Result) throw new Error('Failed to load S&P 500 data');
                const sp500Quotes = sp500Result.indicators.quote[0];
                const sp500Map = new Map();
                sp500Result.timestamp.forEach((ts, i) => {
                    if (sp500Quotes.close[i]) sp500Map.set(new Date(ts * 1000).toISOString().split('T')[0], sp500Quotes.close[i]);
                });

                const m2Url = `https://api.stlouisfed.org/fred/series/observations?series_id=M2SL&api_key=${apiKey}&file_type=json&observation_start=${new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split('T')[0]}`;
                const m2Res = await fetchWithProxy(m2Url);
                if (!m2Res.observations) throw new Error('Failed to load M2 data (Check API Key)');
                const m2Map = new Map();
                m2Res.observations.forEach(obs => m2Map.set(obs.date, parseFloat(obs.value)));

                const allDates = new Set([...sp500Map.keys(), ...m2Map.keys()]);
                const merged = [];
                let curM2 = null, curSP = null;
                Array.from(allDates).sort().forEach(date => {
                    if (m2Map.has(date)) curM2 = m2Map.get(date);
                    if (sp500Map.has(date)) curSP = sp500Map.get(date);
                    if (curM2 !== null && curSP !== null) merged.push({ date, displayDate: date, sp500: curSP, m2: curM2, timestamp: new Date(date).getTime() });
                });

                setData(merged);
                localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: merged }));
            } catch (err) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [apiKey]);

    if (!apiKey) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, padding: 'var(--space-8)', textAlign: 'center', gap: 'var(--space-5)' }}>
            <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-float)' }}>
                <Icons.Key size={32} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h2 style={{ margin: 0, fontSize: 'var(--text-headline-md-size)', fontWeight: 800, color: 'var(--color-on-surface)' }}>需要 FRED API Key</h2>
            <p style={{ margin: 0, color: 'var(--color-on-surface-variant)', fontWeight: 500, maxWidth: 400, lineHeight: 1.6 }}>
                為了顯示 M2 貨幣供給數據，請確認環境變數中已設定 API Key。
            </p>
            <div style={{ background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)', textAlign: 'left', width: '100%', maxWidth: 400 }}>
                <p className="text-label-md" style={{ marginBottom: 8 }}>.env</p>
                <code style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>VITE_FRED_API_KEY=abcdef123456...</code>
            </div>
            <p className="text-label-md">如果您是在 Vercel 部署，請至 Settings &gt; Environment Variables 新增。</p>
        </div>
    );

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 'var(--space-3)', color: 'var(--color-on-surface-variant)' }}>
            <Icons.RefreshedCcw size={24} className="animate-spin" style={{ color: 'var(--color-primary-fixed)' }} />
            <span style={{ fontWeight: 800, fontSize: 'var(--text-label-md-size)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>載入總經資料...</span>
        </div>
    );

    if (error) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 'var(--space-4)' }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.AlertTriangle size={24} style={{ color: 'var(--color-primary)' }} />
            </div>
            <p style={{ margin: 0, color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>{error}</p>
        </div>
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div style={{ background: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-4)', boxShadow: 'var(--shadow-float)' }}>
                <p className="text-label-md" style={{ marginBottom: 8 }}>{new Date(label).toLocaleDateString()}</p>
                {payload.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-6)', marginBottom: 4 }}>
                        <span style={{ fontSize: 'var(--text-label-md-size)', fontWeight: 800, color: entry.color }}>{entry.name}</span>
                        <span style={{ fontWeight: 800, color: 'var(--color-on-surface)', fontVariantNumeric: 'tabular-nums' }}>
                            {entry.name === 'S&P 500' ? Math.round(entry.value).toLocaleString() : entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1px 2px rgba(56,56,49,0.10)' }}>
                    <Icons.TrendingUp size={22} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: 'var(--text-headline-md-size)', fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--color-on-surface)' }}>總經觀察</h2>
                    <p className="text-label-md" style={{ margin: 0 }}>S&P 500 vs. M2 Money Supply</p>
                </div>
            </div>

            <div style={{ background: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ height: 500, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data}>
                            <defs>
                                <linearGradient id="colorSp500" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F9CC61" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#F9CC61" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,56,49,0.08)" vertical={false} />
                            <XAxis dataKey="timestamp" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={t => new Date(t).toLocaleDateString()} axisLine={false} tickLine={false} tick={{ fill: '#6B6A60', fontSize: 11 }} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#7F6000', fontSize: 11 }} domain={['auto', 'auto']} tickFormatter={v => Math.round(v).toLocaleString()} label={{ value: 'S&P 500', angle: -90, position: 'insideLeft', fill: '#7F6000', fontSize: 11 }} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6B6A60', fontSize: 11 }} domain={['auto', 'auto']} tickFormatter={v => (v / 1000).toFixed(1) + 'T'} label={{ value: 'M2 (B)', angle: 90, position: 'insideRight', fill: '#6B6A60', fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 16, color: 'var(--color-on-surface-variant)', fontWeight: 800 }} />
                            <Area yAxisId="left" type="monotone" dataKey="sp500" stroke="#F9CC61" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSp500)" name="S&P 500" dot={false} />
                            <Line yAxisId="right" type="monotone" dataKey="m2" stroke="#6B6A60" strokeWidth={2} dot={false} name="M2 Supply" strokeDasharray="4 2" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-label-md" style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                    Data Sources: Yahoo Finance (S&P 500) · FRED (M2 Money Stock)
                </p>
            </div>
        </div>
    );
};
