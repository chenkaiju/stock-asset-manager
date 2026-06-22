import React from 'react';
import { Icons } from './Icons';
import { formatCurrency } from '../utils/formatters';

export const Dashboard = ({ data, totalValue, marketData, historyData }) => {
    const [showBalance, setShowBalance] = React.useState(false);

    const todayStr = new Date().toLocaleDateString('zh-TW', {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-');

    const candidates = historyData && historyData.length > 0
        ? historyData.filter(h => h.date < todayStr)
        : [];

    const lastHistoryValue = candidates.length > 0
        ? candidates[candidates.length - 1].value
        : (historyData && historyData.length > 0 ? historyData[0].value : totalValue);

    const todayChange = totalValue - lastHistoryValue;
    const todayChangePercent = lastHistoryValue !== 0 ? (todayChange / lastHistoryValue) * 100 : 0;
    const isPositive = todayChange >= 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            
            {/* Market Index Bar */}
            {marketData && (
                <div
                    style={{
                        backgroundColor: 'var(--color-surface-soft)',
                        border: '1px solid var(--color-hairline)',
                        borderRadius: 'var(--radius-none)',
                        padding: 'var(--space-md) var(--space-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 'var(--space-md)',
                        fontFamily: 'var(--font-family)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <Icons.TrendingUp size={16} style={{ color: 'var(--color-primary)' }} />
                        <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-ink)' }}>
                            {marketData.name}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-md)' }}>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>
                            {marketData.index?.toLocaleString()}
                        </span>
                        <span style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: marketData.change?.includes('-') ? 'var(--color-error)' : 'var(--color-success)',
                        }}>
                            {marketData.change?.includes('-')
                                ? <Icons.ArrowDownRight size={14} />
                                : <Icons.ArrowUpRight size={14} />}
                            {marketData.change} ({marketData.percent})
                        </span>
                    </div>
                </div>
            )}

            {/* Total Asset Card - Hero Band Dark */}
            <div
                className="hero-band-dark"
                style={{
                    padding: 'var(--space-xxl) var(--space-xl)',
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{ maxWidth: '800px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}>
                        <Icons.Wallet size={16} style={{ color: 'var(--color-primary)' }} />
                        <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-on-dark-soft)' }}>
                            總資產估值 (PORTFOLIO VALUE)
                        </span>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            style={{
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                padding: '4px', 
                                color: 'var(--color-on-dark-soft)',
                                display: 'flex', 
                                alignItems: 'center',
                                transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-on-dark)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-dark-soft)'}
                        >
                            {showBalance ? <Icons.Eye size={15} /> : <Icons.EyeOff size={15} />}
                        </button>
                    </div>

                    <h2 
                        className="text-display-xl"
                        style={{
                            margin: 0,
                            fontWeight: 700,
                            color: 'var(--color-on-dark)',
                            fontVariantNumeric: 'tabular-nums',
                            marginBottom: 'var(--space-md)',
                            fontSize: 'clamp(32px, 6vw, 64px)'
                        }}
                    >
                        {showBalance ? formatCurrency(totalValue) : '• • • • • •'}
                    </h2>

                    {showBalance ? (
                        <div style={{
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            color: isPositive ? 'var(--color-success)' : 'var(--color-error)',
                            fontSize: '14px',
                            fontWeight: 700,
                            letterSpacing: '0.5px'
                        }}>
                            {isPositive ? <Icons.ArrowUpRight size={16} /> : <Icons.ArrowDownRight size={16} />}
                            {isPositive ? '+' : ''}{Math.round(todayChange).toLocaleString()}
                            &nbsp;({isPositive ? '+' : ''}{todayChangePercent.toFixed(2)}%)
                        </div>
                    ) : (
                        <div style={{
                            display: 'inline-flex', 
                            color: 'var(--color-on-dark-soft)',
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '1.5px',
                        }}>
                            ——
                        </div>
                    )}
                </div>
            </div>

            {/* Top Holdings Section */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-hairline)', paddingBottom: 'var(--space-xs)' }}>
                    <h3 className="text-title-lg" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        主要持股 (KEY HOLDINGS)
                    </h3>
                    <span style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        color: 'var(--color-muted)',
                        textTransform: 'uppercase'
                    }}>
                        共 {data.length} 檔
                    </span>
                </div>

                {/* Grid layout matching model configuration cards (4-up) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...data]
                        .filter(stock => stock.股票名稱 !== '現金' && stock.代號 !== '0000')
                        .sort((a, b) => b.市值 - a.市值)
                        .slice(0, 10)
                        .map((stock) => {
                        const stockPositive = stock.當日漲跌 >= 0;
                        return (
                            <div
                                key={stock.代號}
                                className="model-card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--space-md)',
                                    transition: 'border-color 0.15s ease',
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-hairline-strong)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-hairline)'}
                            >
                                {/* Silhouette / Visual Block */}
                                <div className="model-card-photo" style={{ position: 'relative' }}>
                                    <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-ink)', opacity: 0.08 }}>
                                        {stock.代號.replace('.TW', '')}
                                    </span>
                                    {/* Tech visualization lines */}
                                    <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', height: '16px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
                                        <div style={{ flex: 1, height: '30%', backgroundColor: 'var(--color-surface-strong)' }} />
                                        <div style={{ flex: 1, height: '50%', backgroundColor: 'var(--color-surface-strong)' }} />
                                        <div style={{ flex: 1, height: '80%', backgroundColor: 'var(--color-surface-strong)' }} />
                                        <div style={{ flex: 1, height: '40%', backgroundColor: 'var(--color-surface-strong)' }} />
                                        <div style={{ flex: 1, height: '70%', backgroundColor: stockPositive ? 'var(--color-primary)' : 'var(--color-muted)' }} />
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: stockPositive ? 'var(--color-success)' : 'var(--color-error)',
                                        border: `1px solid ${stockPositive ? 'var(--color-success)' : 'var(--color-error)'}`,
                                        padding: '2px 6px',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {stockPositive ? '▲' : '▼'} {Math.abs(stock.當日漲跌幅).toFixed(2)}%
                                    </div>
                                </div>

                                {/* Stock Details */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <h4 className="text-title-sm" style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {stock.股票名稱}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-muted)', letterSpacing: '0.5px' }}>
                                        代碼: {stock.代號} · {stock.股數?.toLocaleString()} 股
                                    </p>
                                </div>

                                {/* Price & Market Value */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'auto', paddingTop: 'var(--space-xs)', borderTop: '1px solid var(--color-hairline)' }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>現價</p>
                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>
                                            {stock.現價?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>市值</p>
                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>
                                            {formatCurrency(stock.市值)}
                                        </p>
                                    </div>
                                </div>

                                {/* UpperCase Text Link */}
                                <div style={{ marginTop: 'var(--space-xs)' }}>
                                    <a 
                                        href={`https://tw.stock.yahoo.com/quote/${stock.代號.replace('.TW', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-text-link" 
                                        style={{ fontSize: '11px', textDecoration: 'none' }}
                                    >
                                        LEARN MORE ›
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};
