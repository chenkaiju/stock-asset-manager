import React from 'react';
import { Icons } from './Icons';

const CURRENCIES = [
    { code: 'USD', name: '美金', flag: 'us' },
    { code: 'EUR', name: '歐元', flag: 'eu' },
    { code: 'JPY', name: '日圓', flag: 'jp' },
    { code: 'CNY', name: '人民幣', flag: 'cn' },
];

export const ExchangeRates = ({ rates, loading }) => {
    if (loading && (!rates || Object.keys(rates).length === 0)) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xxl)', color: 'var(--color-muted)' }}>
                <Icons.RefreshedCcw size={32} className="animate-spin" style={{ opacity: 0.4, marginBottom: 'var(--space-md)' }} />
                <p style={{ margin: 0, fontWeight: 700, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    載入匯率中...
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', fontFamily: 'var(--font-family)' }}>

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', borderBottom: '1px solid var(--color-hairline)', paddingBottom: 'var(--space-xs)' }}>
                <Icons.Globe size={18} style={{ color: 'var(--color-primary)' }} />
                <div>
                    <h2 className="text-title-lg" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        匯率資訊 (EXCHANGE RATES)
                    </h2>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-muted)' }}>即時匯率 · 兌台幣 TWD</p>
                </div>
            </div>

            {/* Currency cards grid */}
            <div
                style={{
                    backgroundColor: 'var(--color-surface-soft)',
                    border: '1px solid var(--color-hairline)',
                    padding: 'var(--space-md)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 'var(--space-sm)',
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
                            className="configurator-option-tile"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-md)',
                                justifyContent: 'space-between',
                                minHeight: '130px'
                            }}
                        >
                            {/* Flag + name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                <div style={{
                                    width: '32px',
                                    height: '24px',
                                    borderRadius: 'var(--radius-none)',
                                    overflow: 'hidden',
                                    border: '1px solid var(--color-hairline-strong)',
                                    flexShrink: 0,
                                }}>
                                    <img
                                        src={`https://flagcdn.com/w80/${currency.flag}.png`}
                                        alt={currency.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: 'var(--color-ink)' }}>
                                        {currency.code}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-muted)' }}>{currency.name}</p>
                                </div>
                            </div>

                            {/* Price + change */}
                            <div>
                                <p style={{
                                    margin: 0,
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    color: 'var(--color-ink)',
                                    fontVariantNumeric: 'tabular-nums',
                                    lineHeight: 1.2
                                }}>
                                    {price ? price.toFixed(currency.code === 'JPY' ? 4 : 2) : '--'}
                                </p>
                                <p style={{
                                    margin: '2px 0 0',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2px',
                                    color: change
                                        ? (isPositive ? 'var(--color-trend-up)' : 'var(--color-trend-down)')
                                        : 'var(--color-muted)',
                                }}>
                                    {change ? (
                                        <>
                                            {isPositive
                                                ? <Icons.TrendingUp size={12} />
                                                : <Icons.TrendingDown size={12} />}
                                            {change > 0 ? '+' : ''}{change.toFixed(4)} ({percent})
                                        </>
                                    ) : '--'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Disclaimer Alert Card (styled like a cookie consent / flat card) */}
            <div style={{
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--radius-none)',
                padding: 'var(--space-md) var(--space-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
            }}>
                <Icons.Info size={14} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 300, color: 'var(--color-muted)' }}>
                    資料來源：Yahoo Finance。報價可能會有延遲，僅供商業參考。
                </p>
            </div>
        </div>
    );
};
