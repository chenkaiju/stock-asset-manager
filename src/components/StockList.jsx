import React from 'react';
import { Icons } from './Icons';
import { formatCurrency } from '../utils/formatters';

const SORT_OPTIONS = [
    { label: '代號', key: '代號' },
    { label: '市值', key: '市值' },
    { label: '股價', key: '現價' },
    { label: '股數', key: '股數' },
];

export const StockList = ({ data }) => {
    const [sortConfig, setSortConfig] = React.useState({ key: '代號', direction: 'asc' });

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const sortedData = React.useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => {
            let av = a[sortConfig.key];
            let bv = b[sortConfig.key];
            
            if (av == null && bv == null) return 0;
            if (av == null) return 1;
            if (bv == null) return -1;
            
            if (typeof av === 'number' && isNaN(av)) av = 0;
            if (typeof bv === 'number' && isNaN(bv)) bv = 0;
            
            if (typeof av === 'string' && typeof bv === 'string') {
                return sortConfig.direction === 'asc' 
                    ? av.localeCompare(bv) 
                    : bv.localeCompare(av);
            }
            
            if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
            if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const SortArrow = ({ colKey }) => {
        if (sortConfig.key !== colKey) return null;
        return sortConfig.direction === 'asc'
            ? <Icons.ArrowUp size={12} style={{ color: 'var(--color-primary)', marginLeft: '4px' }} />
            : <Icons.ArrowDown size={12} style={{ color: 'var(--color-primary)', marginLeft: '4px' }} />;
    };

    return (
        <div style={{ paddingBottom: 'var(--space-xl)', fontFamily: 'var(--font-family)' }}>

            {/* Sort chips (RWD) */}
            <div style={{ display: 'flex', gap: 'var(--space-xs)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
                {SORT_OPTIONS.map(opt => {
                    const active = sortConfig.key === opt.key;
                    return (
                        <button
                            key={opt.key}
                            onClick={() => handleSort(opt.key)}
                            className={`filter-chip ${active ? 'filter-chip-active' : ''}`}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontFamily: 'var(--font-family)',
                            }}
                        >
                            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {opt.label}
                            </span>
                            {active && (
                                sortConfig.direction === 'asc'
                                    ? <Icons.ArrowUp size={11} />
                                    : <Icons.ArrowDown size={11} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Mobile cards (under 768px) */}
            <div className="md:hidden">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {sortedData.map((stock) => {
                        const stockPositive = stock.當日漲跌 >= 0;
                        return (
                            <div
                                key={stock.代號}
                                style={{
                                    backgroundColor: 'var(--color-canvas)',
                                    border: '1px solid var(--color-hairline)',
                                    borderRadius: 'var(--radius-none)',
                                    padding: 'var(--space-lg)',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: 'var(--radius-none)',
                                            border: '1px solid var(--color-hairline-strong)',
                                            backgroundColor: 'var(--color-surface-soft)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            color: 'var(--color-ink)',
                                        }}>
                                            {stock.股票名稱[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-title-sm" style={{ margin: 0 }}>{stock.股票名稱}</h4>
                                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.5px' }}>{stock.代號}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>
                                            {formatCurrency(stock.市值)}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 700 }}>總值</p>
                                    </div>
                                </div>

                                {/* Detail row grid with hairline dividers */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    borderTop: '1px solid var(--color-hairline)',
                                    paddingTop: 'var(--space-sm)',
                                    gap: 'var(--space-sm)'
                                }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 700 }}>持有股數</p>
                                        <p style={{ margin: '2px 0 0', fontSize: '14px', fontWeight: 700, color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>{stock.股數?.toLocaleString()}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 700 }}>目前股價</p>
                                        <p style={{ margin: '2px 0 0', fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
                                            {stock.現價?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Desktop table (768px and above) */}
            <div
                className="hidden md:block"
                style={{
                    backgroundColor: 'var(--color-canvas)',
                    border: '1px solid var(--color-hairline)',
                    borderRadius: 'var(--radius-none)',
                    overflow: 'hidden',
                }}
            >
                {/* Table header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    padding: 'var(--space-md) var(--space-lg)',
                    borderBottom: '1px solid var(--color-hairline-strong)',
                    backgroundColor: 'var(--color-surface-soft)',
                }}>
                    <button 
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-ink)',
                            fontSize: '12px',
                            fontWeight: 700,
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                            fontFamily: 'var(--font-family)',
                        }}
                        onClick={() => handleSort('代號')}
                    >
                        名稱 / 代號 <SortArrow colKey="代號" />
                    </button>
                    <button 
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-ink)',
                            fontSize: '12px',
                            fontWeight: 700,
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                            fontFamily: 'var(--font-family)',
                        }}
                        onClick={() => handleSort('股數')}
                    >
                        持有股數 <SortArrow colKey="股數" />
                    </button>
                    <button 
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-ink)',
                            fontSize: '12px',
                            fontWeight: 700,
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                            fontFamily: 'var(--font-family)',
                        }}
                        onClick={() => handleSort('現價')}
                    >
                        目前股價 <SortArrow colKey="現價" />
                    </button>
                    <button 
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-ink)',
                            fontSize: '12px',
                            fontWeight: 700,
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            padding: 0,
                            fontFamily: 'var(--font-family)',
                        }}
                        onClick={() => handleSort('市值')}
                    >
                        總市值 <SortArrow colKey="市值" />
                    </button>
                </div>

                {/* Table Body Rows */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {sortedData.map((stock) => (
                        <div
                            key={stock.代號}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                                alignItems: 'center',
                                padding: 'var(--space-md) var(--space-lg)',
                                borderBottom: '1px solid var(--color-hairline)',
                                transition: 'background-color 0.1s ease',
                                cursor: 'default',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            {/* Name & Code */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: 'var(--radius-none)',
                                    border: '1px solid var(--color-hairline)',
                                    backgroundColor: 'var(--color-canvas)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    color: 'var(--color-ink)',
                                }}>
                                    {stock.股票名稱[0]}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-ink)', fontSize: '14px' }}>
                                        {stock.股票名稱}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.5px' }}>
                                        {stock.代號}
                                    </p>
                                </div>
                            </div>

                            {/* Shares */}
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 300, color: 'var(--color-body)', fontVariantNumeric: 'tabular-nums' }}>
                                {stock.股數?.toLocaleString()}
                            </p>

                            {/* Price */}
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
                                {stock.現價?.toLocaleString()}
                            </p>

                            {/* Market Value */}
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--color-ink)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                {formatCurrency(stock.市值)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
