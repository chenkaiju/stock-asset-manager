import React from 'react';
import { Icons } from './Icons';

const CURRENCIES = [
    { code: 'USD', name: '美金', flag: 'us' },
    { code: 'EUR', name: '歐元', flag: 'eu' },
    { code: 'JPY', name: '日圓', flag: 'jp' },
    { code: 'CNY', name: '人民幣', flag: 'cn' },
];

const SkeletonCard = () => (
    <div style={{
        background: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <div className="skeleton" style={{ width: '50%', height: 16 }} />
                <div className="skeleton" style={{ width: '35%', height: 12 }} />
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="skeleton" style={{ width: '60%', height: 32 }} />
            <div className="skeleton" style={{ width: '45%', height: 14 }} />
        </div>
    </div>
);

export const ExchangeRates = ({ rates, loading }) => {
    const isEmpty = !rates || Object.keys(rates).length === 0;
    if (loading && isEmpty) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div className="skeleton" style={{ width: 120, height: 20 }} />
                        <div className="skeleton" style={{ width: 180, height: 14 }} />
                    </div>
                </div>
                <div style={{
                    background: 'var(--color-surface-container-low)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 'var(--space-3)',
                }}>
                    {CURRENCIES.map(c => <SkeletonCard key={c.code} />)}
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{
                    width: 44, height: 44,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-surface-container-high)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'inset 0 1px 2px rgba(56,56,49,0.10)',
                }}>
                    <Icons.Globe size={22} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: 'var(--text-headline-md-size)', fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--color-on-surface)' }}>
                        匯率資訊
                    </h2>
                    <p className="text-label-md" style={{ margin: 0 }}>即時匯率 · 兌台幣 TWD</p>
                </div>
            </div>

            {/* Currency cards */}
            <div
                style={{
                    background: 'var(--color-surface-container-low)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 'var(--space-3)',
                }}
            >
                {CURRENCIES.map((currency) => {
                    const rateData = rates ? rates[currency.code] : null;
                    const price = rateData?.price;
                    const change = rateData?.change;
                    const percent = rateData?.percent;
                    const isPositive = change && parseFloat(change) >= 0;

                    return (
                        <div
                            key={currency.code}
                            style={{
                                background: 'var(--color-surface-container-lowest)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-5)',
                                boxShadow: 'var(--shadow-card)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-4)',
                                transition: 'box-shadow 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-float)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
                        >
                            {/* Flag + name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <div style={{
                                    width: 40, height: 40,
                                    borderRadius: 'var(--radius-sm)',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    boxShadow: 'var(--shadow-card)',
                                }}>
                                    <img
                                        src={`https://flagcdn.com/w80/${currency.flag}.png`}
                                        alt={currency.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--text-title-md-size)', color: 'var(--color-on-surface)' }}>
                                        {currency.code}
                                    </p>
                                    <p className="text-label-md" style={{ margin: 0 }}>{currency.name}</p>
                                </div>
                            </div>

                            {/* Price + change */}
                            <div>
                                <p style={{
                                    margin: 0,
                                    fontSize: '2rem',
                                    fontWeight: 800,
                                    letterSpacing: '-0.02em',
                                    color: 'var(--color-on-surface)',
                                    fontVariantNumeric: 'tabular-nums',
                                }}>
                                    {price ? price.toFixed(currency.code === 'JPY' ? 4 : 2) : '--'}
                                </p>
                                <p style={{
                                    margin: '4px 0 0',
                                    fontSize: 'var(--text-body-lg-size)',
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    color: change
                                        ? (isPositive ? '#c0392b' : '#2d7a4f')
                                        : 'var(--color-on-surface-variant)',
                                }}>
                                    {change ? (
                                        <>
                                            {isPositive
                                                ? <Icons.TrendingUp size={14} />
                                                : <Icons.TrendingDown size={14} />}
                                            {change > 0 ? '+' : ''}{change.toFixed(4)} ({percent})
                                        </>
                                    ) : '--'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Disclaimer */}
            <div style={{
                background: 'var(--color-surface-container-high)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4) var(--space-5)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
            }}>
                <Icons.Info size={15} style={{ color: 'var(--color-on-surface-variant)', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 'var(--text-label-md-size)', fontWeight: 800, letterSpacing: '0.03em', color: 'var(--color-on-surface-variant)' }}>
                    資料來源：Yahoo Finance。報價可能會有延遲，僅供參考。
                </p>
            </div>
        </div>
    );
};
