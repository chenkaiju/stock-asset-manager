import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';

const STOCKS_COLORS = [
    '#1c69d4', // BMW 經典藍 (Stock 1)
    '#2d3748', // 深海青 (Stock 2)
    '#2b6cb0', // 鋼青藍 (Stock 3)
    '#4a5568', // 石板藍 (Stock 4)
    '#3182ce', // 亮藍 (Stock 5)
    '#718096', // 冷灰 (Stock 6)
    '#4299e1', // 天青藍 (Stock 7)
    '#a0aec0', // 石板灰 (Stock 8)
    '#63b3ed', // 淺天藍 (Stock 9)
    '#cbd5e0', // 極淺灰 (Stock 10)
];
const CASH_COLOR = '#22c55e'; // 現金 (綠色)
const OTHERS_COLOR = '#e2e8f0'; // 其他 (淡灰色)

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    return (
        <div style={{
            backgroundColor: 'var(--color-canvas)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-none)',
            padding: 'var(--space-md)',
            boxShadow: 'none',
        }}>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 700 }}>
                {data.code !== 'CASH' && data.code !== 'OTHERS' ? `${data.code} · ` : ''}{data.name}
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 700, color: 'var(--color-ink)' }}>
                市值: {formatCurrency(data.value)}
            </p>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                佔比: {data.percentage.toFixed(2)}%
            </p>
        </div>
    );
};

export const HoldingsPieChart = ({ data, totalValue }) => {
    if (!data || data.length === 0 || !totalValue) {
        return null;
    }

    // 1. Separate Cash
    const cashData = data.filter(stock => stock.股票名稱 === '現金' || stock.代號 === '0000');
    const cashValue = cashData.reduce((sum, s) => sum + (s.市值 || 0), 0);

    // 2. Separate Stocks (and validate)
    const stocksData = data.filter(stock => stock.股票名稱 !== '現金' && stock.代號 !== '0000' && (stock.市值 > 0 || stock.股數 > 0));
    
    // 3. Sort stocks by Market Value descending
    const sortedStocks = [...stocksData].sort((a, b) => (b.市值 || 0) - (a.市值 || 0));

    // 4. Split into Top 10 and Rest
    const top10 = sortedStocks.slice(0, 10);
    const restStocks = sortedStocks.slice(10);
    const restValue = restStocks.reduce((sum, s) => sum + (s.市值 || 0), 0);

    // 5. Construct Combined Items
    const items = [];
    top10.forEach(s => {
        items.push({
            name: s.股票名稱,
            code: s.代號.replace('.TW', ''),
            value: s.市值 || 0,
            type: 'stock',
        });
    });

    if (cashValue > 0) {
        items.push({
            name: '現金',
            code: 'CASH',
            value: cashValue,
            type: 'cash',
        });
    }

    if (restValue > 0) {
        items.push({
            name: '其他持股',
            code: 'OTHERS',
            value: restValue,
            type: 'others',
        });
    }

    // Sort all slices by market value descending
    const sortedItems = items.sort((a, b) => b.value - a.value);

    // Calculate percentages & assign colors
    let stockColorIndex = 0;
    const chartData = sortedItems.map(item => {
        const percentage = (item.value / totalValue) * 100;
        let color = '';
        if (item.type === 'cash') {
            color = CASH_COLOR;
        } else if (item.type === 'others') {
            color = OTHERS_COLOR;
        } else {
            color = STOCKS_COLORS[stockColorIndex % STOCKS_COLORS.length];
            stockColorIndex++;
        }
        return {
            ...item,
            percentage,
            color,
        };
    });

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-lg)',
            fontFamily: 'var(--font-family)',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-hairline)', paddingBottom: 'var(--space-xs)' }}>
                <h3 className="text-title-lg" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-ink)' }}>
                    資產配置
                </h3>
            </div>

            {/* Content Section - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12" style={{
                gap: 'var(--space-lg)',
            }}>
                
                {/* Left Column: Pie Chart (60% width on md) */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 280,
                }} className="md:col-span-7">
                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--color-canvas)" strokeWidth={1} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Allocation Detail List (40% width on md) */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }} className="md:col-span-5">
                    <div style={{
                        maxHeight: 280,
                        overflowY: 'auto',
                        border: '1px solid var(--color-hairline)',
                        borderRadius: 'var(--radius-none)',
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-surface-soft)', textAlign: 'left' }}>
                                    <th style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--color-muted)', width: '60%' }}>資產名稱</th>
                                    <th style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--color-muted)', textAlign: 'right', width: '20%' }}>佔比</th>
                                    <th style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--color-muted)', textAlign: 'right', width: '20%' }}>市值</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData.map((item, index) => (
                                    <tr 
                                        key={index} 
                                        style={{ 
                                            borderBottom: index < chartData.length - 1 ? '1px solid var(--color-hairline)' : 'none',
                                            transition: 'background-color 0.15s ease',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                width: '10px',
                                                height: '10px',
                                                backgroundColor: item.color,
                                                borderRadius: 'var(--radius-none)',
                                                flexShrink: 0
                                            }} />
                                            <span 
                                                style={{ fontWeight: 700, color: 'var(--color-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                title={item.name}
                                            >
                                                {item.name}
                                            </span>
                                            {item.type === 'stock' && (
                                                <span style={{ fontSize: '10px', color: 'var(--color-muted)', marginLeft: '4px' }}>
                                                    {item.code}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>
                                            {item.percentage.toFixed(2)}%
                                        </td>
                                        <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums' }}>
                                            {item.value >= 1000000 ? `${(item.value / 1000000).toFixed(2)}M` : `${(item.value / 1000).toFixed(0)}K`}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};
