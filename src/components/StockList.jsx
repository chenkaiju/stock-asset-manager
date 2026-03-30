import React from 'react';
import { Icons } from './Icons';
import { formatCurrency } from '../utils/formatters';

const SORT_OPTIONS = [
    { label: '代號', key: '代號' },
    { label: '市值', key: '市值' },
    { label: '股價', key: '現價' },
    { label: '股數', key: '股數' },
];

const colStyle = {
    label: { color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-label-md-size)', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', userSelect: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
};

const Sk = ({ w = '100%', h = 14, style = {} }) => (
    <div className="skeleton" style={{ width: w, height: h, ...style }} />
);

const SKELETON_ROWS = 4;

export const StockList = ({ data, loading }) => {
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
            const av = a[sortConfig.key], bv = b[sortConfig.key];
            if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
            if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const SortArrow = ({ colKey }) => {
        if (sortConfig.key !== colKey) return null;
        return sortConfig.direction === 'asc'
            ? <Icons.ArrowUp size={12} style={{ color: 'var(--color-primary)' }} />
            : <Icons.ArrowDown size={12} style={{ color: 'var(--color-primary)' }} />;
    };

    return (
        <div style={{ paddingBottom: 'var(--space-8)' }}>

            {/* Sort chips (mobile + desktop) */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
                {SORT_OPTIONS.map(opt => {
                    const active = sortConfig.key === opt.key;
                    return (
                        <button
                            key={opt.key}
                            onClick={() => handleSort(opt.key)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-pill)',
                                border: 'none', cursor: 'pointer',
                                background: active ? 'var(--color-primary-fixed)' : 'var(--color-surface-container-high)',
                                color: active ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
                                fontSize: 'var(--text-label-md-size)',
                                fontWeight: 800,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                transition: 'background 0.15s, transform 0.1s',
                                fontFamily: 'var(--font-family)',
                            }}
                        >
                            {opt.label}
                            {active && (
                                sortConfig.direction === 'asc'
                                    ? <Icons.ArrowUp size={11} />
                                    : <Icons.ArrowDown size={11} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Mobile cards */}
            <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {loading ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                    <div key={i} style={{ background: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <Sk w={40} h={40} style={{ borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <Sk w={90} h={14} />
                                    <Sk w={60} h={11} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                                <Sk w={80} h={18} />
                                <Sk w={40} h={11} />
                            </div>
                        </div>
                        <Sk w="100%" h={48} style={{ borderRadius: 'var(--radius-sm)' }} />
                    </div>
                )) : sortedData.map((stock) => (
                    <div
                        key={stock.代號}
                        style={{
                            background: 'var(--color-surface-container-lowest)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-5)',
                            boxShadow: 'var(--shadow-card)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                                    background: 'var(--gradient-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 800, color: 'var(--color-on-primary-fixed)',
                                }}>
                                    {stock.股票名稱[0]}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 800, color: 'var(--color-on-surface)' }}>{stock.股票名稱}</p>
                                    <p style={{ margin: 0, fontSize: 'var(--text-label-md-size)', color: 'var(--color-on-surface-variant)', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{stock.代號}</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--text-title-md-size)', color: 'var(--color-on-surface)', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(stock.市值)}</p>
                                <p style={{ margin: 0, fontSize: 'var(--text-label-md-size)', color: 'var(--color-on-surface-variant)', fontWeight: 800, letterSpacing: '0.04em' }}>總市值</p>
                            </div>
                        </div>

                        {/* Divider via gap, not line */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            background: 'var(--color-surface-container-high)',
                            borderRadius: 'var(--radius-sm)',
                            padding: 'var(--space-3) var(--space-4)',
                        }}>
                            <div>
                                <p style={{ margin: 0, fontSize: 'var(--text-label-md-size)', color: 'var(--color-on-surface-variant)', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>持有股數</p>
                                <p style={{ margin: '4px 0 0', fontWeight: 800, color: 'var(--color-on-surface)', fontVariantNumeric: 'tabular-nums' }}>{stock.股數?.toLocaleString()}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontSize: 'var(--text-label-md-size)', color: 'var(--color-on-surface-variant)', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>目前股價</p>
                                <p style={{ margin: '4px 0 0', fontWeight: 800, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>{stock.現價?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table — styled as card list, no divider lines */}
            <div
                className="hidden md:block"
                style={{
                    background: 'var(--color-surface-container-low)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4)',
                }}
            >
                {/* Table header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    padding: 'var(--space-2) var(--space-4)',
                    marginBottom: 'var(--space-2)',
                }}>
                    <button style={colStyle.label} onClick={() => handleSort('代號')}>
                        名稱 / 代號 <SortArrow colKey="代號" />
                    </button>
                    <button style={colStyle.label} onClick={() => handleSort('股數')}>
                        持有股數 <SortArrow colKey="股數" />
                    </button>
                    <button style={colStyle.label} onClick={() => handleSort('現價')}>
                        目前股價 <SortArrow colKey="現價" />
                    </button>
                    <button style={{ ...colStyle.label, justifyContent: 'flex-end' }} onClick={() => handleSort('市值')}>
                        總市值 <SortArrow colKey="市值" />
                    </button>
                </div>

                {/* Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {loading ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                        <div key={i} style={{
                            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center',
                            background: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-sm)',
                            padding: 'var(--space-4)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <Sk w={36} h={36} style={{ borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <Sk w={100} h={14} />
                                    <Sk w={60} h={11} />
                                </div>
                            </div>
                            <Sk w={60} h={14} />
                            <Sk w={60} h={14} />
                            <Sk w={80} h={14} style={{ marginLeft: 'auto' }} />
                        </div>
                    )) : sortedData.map((stock) => (
                        <div
                            key={stock.代號}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                                alignItems: 'center',
                                background: 'var(--color-surface-container-lowest)',
                                borderRadius: 'var(--radius-sm)',
                                padding: 'var(--space-4)',
                                boxShadow: 'var(--shadow-card)',
                                transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                                cursor: 'default',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'scale(1.004)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-float)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                            }}
                        >
                            {/* Name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                                    background: 'var(--gradient-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 800, fontSize: '0.9rem',
                                    color: 'var(--color-on-primary-fixed)',
                                    flexShrink: 0,
                                }}>
                                    {stock.股票名稱[0]}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 800, color: 'var(--color-on-surface)' }}>{stock.股票名稱}</p>
                                    <p style={{ margin: 0, fontSize: 'var(--text-label-md-size)', color: 'var(--color-on-surface-variant)', fontWeight: 800, letterSpacing: '0.05em' }}>{stock.代號}</p>
                                </div>
                            </div>

                            {/* Shares */}
                            <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-on-surface)', fontVariantNumeric: 'tabular-nums' }}>
                                {stock.股數?.toLocaleString()}
                            </p>

                            {/* Price */}
                            <p style={{ margin: 0, fontWeight: 800, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
                                {stock.現價?.toLocaleString()}
                            </p>

                            {/* Value */}
                            <p style={{ margin: 0, fontWeight: 800, color: 'var(--color-on-surface)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                {formatCurrency(stock.市值)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
