import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Icons } from './Icons';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--color-surface-container-lowest)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-4)',
            boxShadow: 'var(--shadow-float)',
        }}>
            <p className="text-label-md" style={{ marginBottom: 8 }}>{label}</p>
            {payload.map((entry, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-5)', marginBottom: 4 }}>
                    <span style={{ fontSize: 'var(--text-label-md-size)', fontWeight: 800, color: entry.color }}>{entry.name}</span>
                    <span style={{ fontWeight: 800, color: 'var(--color-on-surface)', fontVariantNumeric: 'tabular-nums' }}>
                        {(entry.name.includes('率') || entry.name.includes('幅度')) && !entry.name.includes('夏普')
                            ? (Number(entry.value) * 100).toFixed(2) + '%'
                            : Number(entry.value).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                </div>
            ))}
        </div>
    );
};

const ChartCard = ({ title, icon: Icon, children }) => (
    <div style={{
        background: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-card)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <div style={{
                width: 32, height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-surface-container-high)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 1px 2px rgba(56,56,49,0.10)',
            }}>
                <Icon size={16} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: 'var(--text-title-md-size)', fontWeight: 800, color: 'var(--color-on-surface)' }}>{title}</h3>
        </div>
        <div style={{ height: 250, width: '100%' }}>
            {children}
        </div>
    </div>
);

const axisStyle = { fill: '#6B6A60', fontSize: 10 };
const gridStyle = { stroke: 'rgba(56,56,49,0.07)', strokeDasharray: '3 3' };

export const HistoryChart = ({ historyData }) => {
    if (!historyData || historyData.length === 0) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: 'var(--space-12)',
                background: 'var(--color-surface-container-low)',
                borderRadius: 'var(--radius-lg)',
                gap: 'var(--space-4)',
            }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.Activity size={24} style={{ color: 'var(--color-on-surface-variant)', opacity: 0.5 }} />
                </div>
                <p style={{ margin: 0, fontWeight: 800, color: 'var(--color-on-surface-variant)' }}>尚無趨勢分析數據</p>
                <p className="text-label-md">請確認同步資料中是否包含歷史數據</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

            {/* Asset Value */}
            <div style={{ background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                <ChartCard title="資產總額走勢" icon={Icons.TrendingUp}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historyData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F9CC61" stopOpacity={0.30} />
                                    <stop offset="95%" stopColor="#F9CC61" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...gridStyle} vertical={false} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={axisStyle} minTickGap={30} />
                            <YAxis axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area name="總值" type="monotone" dataKey="value" stroke="#F9CC61" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Bottom two charts */}
            <div style={{ background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-3)' }}>

                {/* Drawdown */}
                <ChartCard title="水下圖 (Drawdown)" icon={Icons.TrendingDown}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historyData}>
                            <defs>
                                <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F99681" stopOpacity={0.30} />
                                    <stop offset="95%" stopColor="#F99681" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...gridStyle} vertical={false} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={axisStyle} hide />
                            <YAxis axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area name="回撤幅度" type="monotone" dataKey="drawdown" stroke="#F99681" strokeWidth={2} fillOpacity={1} fill="url(#colorDrawdown)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Sharpe & Volatility */}
                <ChartCard title="品質走勢 (Sharpe & Vol)" icon={Icons.Activity}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historyData}>
                            <CartesianGrid {...gridStyle} vertical={false} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={axisStyle} hide />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ ...axisStyle, fill: '#7F6000' }} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10, fontWeight: 800, color: 'var(--color-on-surface-variant)' }} />
                            <Line yAxisId="left" name="夏普比率" type="monotone" dataKey="sharpe" stroke="#F9CC61" strokeWidth={2} dot={false} />
                            <Line yAxisId="right" name="年化波動率" type="monotone" dataKey="volatility" stroke="#BBBAB0" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};
