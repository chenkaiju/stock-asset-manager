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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, padding: 'var(--space-xl)', textAlign: 'center', gap: 'var(--space-md)', fontFamily: 'var(--font-family)' }}>
            <div style={{ width: 64, height: 64, border: '1px solid var(--color-hairline-strong)', backgroundColor: 'var(--color-surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Key size={24} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h2 className="text-title-lg" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>需要 FRED API Key</h2>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '14px', maxWidth: 400, lineHeight: 1.6 }}>
                為了顯示 M2 貨幣供給數據，請確認環境變數中已設定 API Key。
            </p>
            <div style={{ backgroundColor: 'var(--color-surface-soft)', border: '1px solid var(--color-hairline)', padding: 'var(--space-md) var(--space-lg)', textAlign: 'left', width: '100%', maxWidth: 400 }}>
                <p className="text-label-uppercase" style={{ marginBottom: 4, fontSize: '11px', color: 'var(--color-muted)' }}>.env</p>
                <code style={{ fontSize: '13px', color: 'var(--color-primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    VITE_FRED_API_KEY=abcdef123456...
                </code>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-muted)' }}>如果您是在 Vercel 部署，請至 Settings &gt; Environment Variables 新增。</p>
        </div>
    );

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 'var(--space-sm)', color: 'var(--color-muted)', fontFamily: 'var(--font-family)' }}>
            <Icons.RefreshedCcw size={20} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>載入總經資料...</span>
        </div>
    );

    if (error) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 'var(--space-sm)', fontFamily: 'var(--font-family)' }}>
            <div style={{ width: 48, height: 48, border: '1px solid var(--color-error)', backgroundColor: 'var(--color-surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.AlertTriangle size={20} style={{ color: 'var(--color-error)' }} />
            </div>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '14px' }}>{error}</p>
        </div>
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div style={{ backgroundColor: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', padding: 'var(--space-md)', borderRadius: 'var(--radius-none)' }}>
                <p className="text-label-uppercase" style={{ marginBottom: 8, fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.5px' }}>
                    {new Date(label).toLocaleDateString()}
                </p>
                {payload.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-lg)', marginBottom: 4 }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: entry.color }}>{entry.name}</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums', fontSize: '13px' }}>
                            {entry.name === 'S&P 500' ? Math.round(entry.value).toLocaleString() : entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', fontFamily: 'var(--font-family)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', borderBottom: '1px solid var(--color-hairline)', paddingBottom: 'var(--space-xs)' }}>
                <Icons.TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
                <div>
                    <h2 className="text-title-lg" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        總經觀察 (MACRO INSIGHTS)
                    </h2>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-muted)' }}>S&P 500 vs. M2 Money Supply</p>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-none)', padding: 'var(--space-lg)' }}>
                <div style={{ height: 450, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSp500" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline)" vertical={false} />
                            <XAxis 
                                dataKey="timestamp" 
                                type="number" 
                                scale="time" 
                                domain={['dataMin', 'dataMax']} 
                                tickFormatter={t => new Date(t).toLocaleDateString()} 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-family)' }} 
                            />
                            <YAxis 
                                yAxisId="left" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'var(--color-primary)', fontSize: 11, fontFamily: 'var(--font-family)', fontWeight: 700 }} 
                                domain={['auto', 'auto']} 
                                tickFormatter={v => Math.round(v).toLocaleString()} 
                                label={{ value: 'S&P 500', angle: -90, position: 'insideLeft', fill: 'var(--color-primary)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-family)' }} 
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-family)' }} 
                                domain={['auto', 'auto']} 
                                tickFormatter={v => (v / 1000).toFixed(1) + 'T'} 
                                label={{ value: 'M2 (B)', angle: 90, position: 'insideRight', fill: 'var(--color-muted)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-family)' }} 
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                wrapperStyle={{ 
                                    fontSize: 11, 
                                    paddingTop: 16, 
                                    color: 'var(--color-ink)', 
                                    fontWeight: 700,
                                    fontFamily: 'var(--font-family)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }} 
                            />
                            <Area yAxisId="left" type="monotone" dataKey="sp500" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorSp500)" name="S&P 500" dot={false} />
                            <Line yAxisId="right" type="monotone" dataKey="m2" stroke="var(--color-muted)" strokeWidth={1.5} dot={false} name="M2 Supply" strokeDasharray="4 2" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <p style={{ marginTop: 'var(--space-md)', textAlign: 'center', fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.5px' }}>
                    Data Sources: Yahoo Finance (S&P 500) · FRED (M2 Money Stock)
                </p>
            </div>
        </div>
    );
};
