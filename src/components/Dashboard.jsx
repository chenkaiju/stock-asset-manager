import React from 'react';
import { Icons } from './Icons';
import { formatCurrency } from '../utils/formatters';

const Sk = ({ w = '100%', h = 16, style = {} }) => (
    <div className="skeleton" style={{ width: w, height: h, ...style }} />
);

export const Dashboard = ({ data, totalValue, marketData, historyData, loading }) => {
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

            {/* Market Index */}
            {marketData && (
                <div
                    style={{
                        background: 'var(--color-surface-container-low)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4) var(--space-6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 'var(--space-4)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                            width: 40, height: 40,
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--color-surface-container-high)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: 'inset 0 1px 2px rgba(56,56,49,0.10)',
                        }}>
                            <Icons.TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <div>
                            <p className="text-label-md">Market Index</p>
                            <h3 style={{ margin: 0, fontSize: 'var(--text-title-md-size)', fontWeight: 800, color: 'var(--color-on-surface)' }}>
                                {marketData.name}
                            </h3>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
                        {loading ? (
                            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                                <Sk w={110} h={28} />
                                <Sk w={80} h={18} />
                            </div>
                        ) : (
                            <>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-on-surface)', fontVariantNumeric: 'tabular-nums' }}>
                                    {marketData.index?.toLocaleString()}
                                </span>
                                <span style={{
                                    fontSize: 'var(--text-body-lg-size)',
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    color: marketData.change?.includes('-') ? '#2d7a4f' : '#c0392b',
                                }}>
                                    {marketData.change?.includes('-')
                                        ? <Icons.ArrowDownRight size={16} />
                                        : <Icons.ArrowUpRight size={16} />}
                                    {marketData.change} ({marketData.percent})
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Total Asset Card */}
            <div
                style={{
                    background: 'var(--color-surface-container-lowest)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-8)',
                    boxShadow: 'var(--shadow-float)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Warm glow decoration */}
                <div style={{
                    position: 'absolute', top: -60, right: -60,
                    width: 200, height: 200,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(249,204,97,0.18) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                        <Icons.Wallet size={16} style={{ color: 'var(--color-primary)' }} />
                        <span className="text-label-md">總資產估值</span>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: '4px', borderRadius: 'var(--radius-pill)',
                                color: 'var(--color-on-surface-variant)',
                                display: 'flex', alignItems: 'center',
                                transition: 'color 0.15s',
                            }}
                        >
                            {showBalance ? <Icons.Eye size={15} /> : <Icons.EyeOff size={15} />}
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <h2 style={{
                            margin: 0,
                            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            color: 'var(--color-on-surface)',
                            fontVariantNumeric: 'tabular-nums',
                        }}>
                            {showBalance ? formatCurrency(totalValue) : '• • • • •'}
                        </h2>

                        {showBalance ? (
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-pill)',
                                background: isPositive
                                    ? 'rgba(192, 57, 43, 0.10)'
                                    : 'rgba(45, 122, 79, 0.10)',
                                color: isPositive ? '#c0392b' : '#2d7a4f',
                                fontSize: 'var(--text-body-lg-size)',
                                fontWeight: 800,
                            }}>
                                {isPositive ? <Icons.ArrowUpRight size={15} /> : <Icons.ArrowDownRight size={15} />}
                                {isPositive ? '+' : ''}{Math.round(todayChange).toLocaleString()}
                                &nbsp;({isPositive ? '+' : ''}{todayChangePercent.toFixed(2)}%)
                            </div>
                        ) : (
                            <div style={{
                                display: 'inline-flex', alignItems: 'center',
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-pill)',
                                background: 'var(--color-surface-container-high)',
                                color: 'var(--color-on-surface-variant)',
                                fontSize: 'var(--text-label-md-size)',
                                fontWeight: 800,
                                letterSpacing: '0.05em',
                            }}>
                                ——
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Holdings */}
            <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                    <h4 style={{ margin: 0, fontSize: 'var(--text-title-md-size)', fontWeight: 800, color: 'var(--color-on-surface)' }}>
                        主要持股
                    </h4>
                    <span style={{
                        background: 'var(--color-surface-container-high)',
                        borderRadius: 'var(--radius-pill)',
                        padding: '2px 10px',
                        fontSize: 'var(--text-label-md-size)',
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        color: 'var(--color-on-surface-variant)',
                        textTransform: 'uppercase',
                    }}>
                        共 {data.length} 檔
                    </span>
                </div>

                <div style={{
                    background: 'var(--color-surface-container-low)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    padding: 'var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                }}>
                    {loading ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: 'var(--space-4)',
                            background: 'var(--color-surface-container-lowest)',
                            borderRadius: 'var(--radius-sm)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '30%' }}>
                                <Sk w={40} h={40} style={{ borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <Sk w="80%" h={14} />
                                    <Sk w="50%" h={11} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '35%' }}>
                                <Sk w={60} h={14} />
                                <Sk w={80} h={11} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, width: '35%' }}>
                                <Sk w={80} h={14} />
                                <Sk w={50} h={11} />
                            </div>
                        </div>
                    )) : [...data].sort((a, b) => b.市值 - a.市值).slice(0, 10).map((stock) => (
                        <div
                            key={stock.代號}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 'var(--space-4)',
                                background: 'var(--color-surface-container-lowest)',
                                borderRadius: 'var(--radius-sm)',
                                boxShadow: 'var(--shadow-card)',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'scale(1.005)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-float)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                            }}
                        >
                            {/* Avatar + Name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '30%' }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                                    background: 'var(--gradient-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 800, fontSize: '1rem',
                                    color: 'var(--color-on-primary-fixed)',
                                    flexShrink: 0,
                                    boxShadow: 'var(--shadow-card)',
                                }}>
                                    {stock.股票名稱[0]}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--text-body-lg-size)', color: 'var(--color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {stock.股票名稱}
                                    </p>
                                    <p style={{ margin: 0, fontSize: 'var(--text-label-md-size)', color: 'var(--color-on-surface-variant)', fontWeight: 800, letterSpacing: '0.05em' }}>
                                        {stock.代號}
                                    </p>
                                </div>
                            </div>

                            {/* Price + Change */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '35%' }}>
                                <p style={{
                                    margin: 0, fontWeight: 800,
                                    fontSize: 'var(--text-body-lg-size)',
                                    color: stock.當日漲跌 >= 0 ? '#c0392b' : '#2d7a4f',
                                    fontVariantNumeric: 'tabular-nums',
                                }}>
                                    {stock.現價?.toLocaleString()}
                                </p>
                                <p style={{
                                    margin: 0, fontSize: '0.8rem', fontWeight: 500,
                                    color: stock.當日漲跌 >= 0 ? 'rgba(192,57,43,0.75)' : 'rgba(45,122,79,0.75)',
                                }}>
                                    {stock.當日漲跌 > 0 ? '+' : ''}{Number(stock.當日漲跌).toFixed(2)}
                                    &nbsp;({Number(stock.當日漲跌幅).toFixed(2)}%)
                                </p>
                            </div>

                            {/* Value + Shares */}
                            <div style={{ textAlign: 'right', width: '35%' }}>
                                <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--text-body-lg-size)', color: 'var(--color-on-surface)', fontVariantNumeric: 'tabular-nums' }}>
                                    {formatCurrency(stock.市值)}
                                </p>
                                <p style={{ margin: 0, fontSize: 'var(--text-label-md-size)', color: 'var(--color-on-surface-variant)', fontWeight: 800, marginTop: 2, letterSpacing: '0.03em' }}>
                                    {stock.股數?.toLocaleString()} 股
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
