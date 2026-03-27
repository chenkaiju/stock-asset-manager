import React from 'react';
import { Icons } from './Icons';

export const PerformanceStats = ({ stats }) => {
    const displayStats = stats || {};

    const formatVal = (val, type = 'number', precision = 2) => {
        if (val === undefined || val === null || val === '') return '--';
        const num = Number(val);
        if (isNaN(num)) return val;
        if (type === 'percent') {
            const prefix = num > 0 ? '+' : '';
            return `${prefix}${(num * 100).toFixed(2)}%`;
        }
        return num.toLocaleString(undefined, { maximumFractionDigits: precision });
    };

    const MetricCard = ({ title, value, unit, description, isPercent = false, precision = 2 }) => (
        <div
            style={{
                background: 'var(--color-surface-container-lowest)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-float)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{
                    margin: 0,
                    fontSize: 'var(--text-label-md-size)',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--color-on-surface-variant)',
                }}>
                    {title}
                </p>
                {description && (
                    <div style={{ position: 'relative' }} className="group">
                        <Icons.Info size={13} style={{ color: 'var(--color-on-surface-variant)', cursor: 'help', opacity: 0.5 }} />
                        <div style={{
                            position: 'absolute', right: 0, bottom: '100%', marginBottom: 8,
                            width: 192, padding: 'var(--space-3)',
                            background: 'var(--color-surface-container-high)',
                            borderRadius: 'var(--radius-sm)',
                            boxShadow: 'var(--shadow-float)',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color: 'var(--color-on-surface-variant)',
                            pointerEvents: 'none',
                            zIndex: 50,
                            lineHeight: 1.5,
                        }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            {description}
                        </div>
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                <span style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-on-surface)',
                    fontVariantNumeric: 'tabular-nums',
                }}>
                    {isPercent ? formatVal(value, 'percent') : formatVal(value, 'number', precision)}
                </span>
                {unit && (
                    <span style={{ fontSize: 'var(--text-label-md-size)', color: 'var(--color-on-surface-variant)', fontWeight: 800 }}>
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );

    const SectionHeader = ({ icon, title }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <div style={{
                width: 36, height: 36,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-surface-container-high)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 1px 2px rgba(56,56,49,0.10)',
            }}>
                {icon}
            </div>
            <h3 style={{ margin: 0, fontSize: 'var(--text-title-md-size)', fontWeight: 800, color: 'var(--color-on-surface)' }}>
                {title}
            </h3>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>

            {/* Efficiency */}
            <section>
                <SectionHeader
                    icon={<Icons.BarChart3 size={18} style={{ color: 'var(--color-primary)' }} />}
                    title="投資效率 (Efficiency)"
                />
                <div
                    style={{
                        background: 'var(--color-surface-container-low)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: 'var(--space-3)',
                    }}
                >
                    <MetricCard title="夏普比率" value={displayStats["夏普比率"]} description="每單位風險換來的超額回報。> 1 代表表現良好。" />
                    <MetricCard title="索提諾比率" value={displayStats["索提諾比率"]} description="專注於下行風險的回報比。越高越好。" />
                    <MetricCard title="Calmar Ratio" value={displayStats["Calmar Ratio"]} description="年化報酬與最大回撤的比值。" />
                    <MetricCard title="年化報酬率" value={displayStats["年化報酬率"]} isPercent description="將波段報酬轉換為年度計算的收益率。" />
                </div>
            </section>

            {/* Risk */}
            <section>
                <SectionHeader
                    icon={<Icons.Shield size={18} style={{ color: 'var(--color-primary)' }} />}
                    title="風險管理 (Risk Control)"
                />
                <div
                    style={{
                        background: 'var(--color-surface-container-low)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: 'var(--space-3)',
                    }}
                >
                    <MetricCard title="最大回撤 (MDD)" value={displayStats["最大回撤 (MDD)"]} isPercent description="從歷史最高點回落的最大幅度。越小越安全。" />
                    <MetricCard title="年化波動率" value={displayStats["年化波動率"]} isPercent description="資產價格變動的劇烈程度。" />
                </div>
            </section>

            {/* Other */}
            <section>
                <SectionHeader
                    icon={<Icons.TrendingUp size={18} style={{ color: 'var(--color-on-surface-variant)' }} />}
                    title="其他指標 (Other)"
                />
                <div
                    style={{
                        background: 'var(--color-surface-container-low)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: 'var(--space-3)',
                    }}
                >
                    <MetricCard title="歷史最高" value={displayStats["累計總值高峰"]} precision={0} description="歷史上曾達到過的最高資產總額。" />
                </div>
            </section>
        </div>
    );
};
