import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Icons } from './Icons';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            backgroundColor: 'var(--color-canvas)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-none)',
            padding: 'var(--space-md)',
        }}>
            <p className="text-label-uppercase" style={{ marginBottom: 8, fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.5px' }}>{label}</p>
            {payload.map((entry, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-lg)', marginBottom: 4 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: entry.color }}>{entry.name}</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums', fontSize: '13px' }}>
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
        backgroundColor: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-none)',
        padding: 'var(--space-lg)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            <Icon size={16} style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-title-sm" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-ink)' }}>{title}</h3>
        </div>
        <div style={{ height: 260, width: '100%' }}>
            {children}
        </div>
    </div>
);

const axisStyle = { fill: 'var(--color-muted)', fontSize: 10, fontFamily: 'var(--font-family)' };
const gridStyle = { stroke: 'var(--color-hairline)', strokeDasharray: '3 3' };

export const HistoryChart = ({ historyData }) => {
    if (!historyData || historyData.length === 0) {
        return (
            <div style={{
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: 'var(--space-xxl)',
                backgroundColor: 'var(--color-surface-soft)',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--radius-none)',
                gap: 'var(--space-md)',
                fontFamily: 'var(--font-family)',
            }}>
                <div style={{ width: 48, height: 48, border: '1px solid var(--color-hairline-strong)', backgroundColor: 'var(--color-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.Activity size={20} style={{ color: 'var(--color-muted)', opacity: 0.5 }} />
                </div>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-ink)', fontSize: '14px' }}>尚無趨勢分析數據</p>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-muted)' }}>請確認同步資料中是否包含歷史數據</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', fontFamily: 'var(--font-family)' }}>

            {/* Asset Value */}
            <div style={{ backgroundColor: 'var(--color-surface-soft)', border: '1px solid var(--color-hairline)', padding: 'var(--space-md)' }}>
                <ChartCard title="資產總額走勢 (TOTAL PORTFOLIO TREND)" icon={Icons.TrendingUp}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historyData} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...gridStyle} vertical={false} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={axisStyle} minTickGap={30} />
                            <YAxis axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area name="總值" type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Bottom two charts */}
            <div style={{ 
                backgroundColor: 'var(--color-surface-soft)', 
                border: '1px solid var(--color-hairline)', 
                padding: 'var(--space-md)', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: 'var(--space-md)' 
            }}>

                {/* Drawdown */}
                <ChartCard title="水下圖 (MAX DRAWDOWN)" icon={Icons.TrendingDown}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historyData} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-m-red)" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="var(--color-m-red)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...gridStyle} vertical={false} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={axisStyle} hide />
                            <YAxis axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area name="回撤幅度" type="monotone" dataKey="drawdown" stroke="var(--color-m-red)" strokeWidth={2} fillOpacity={1} fill="url(#colorDrawdown)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Sharpe & Volatility */}
                <ChartCard title="品質走勢 (SHARPE & VOLATILITY)" icon={Icons.Activity}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historyData} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
                            <CartesianGrid {...gridStyle} vertical={false} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={axisStyle} hide />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ ...axisStyle, fill: 'var(--color-primary)', fontWeight: 700 }} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                iconType="rect" 
                                wrapperStyle={{ 
                                    fontSize: 10, 
                                    paddingTop: 10, 
                                    fontWeight: 700, 
                                    color: 'var(--color-ink)',
                                    fontFamily: 'var(--font-family)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }} 
                            />
                            <Line yAxisId="left" name="夏普比率" type="monotone" dataKey="sharpe" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                            <Line yAxisId="right" name="年化波動率" type="monotone" dataKey="volatility" stroke="var(--color-muted)" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};
