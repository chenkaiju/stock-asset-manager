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
            className="configurator-option-tile"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-xs)',
                position: 'relative',
                justifyContent: 'space-between',
                minHeight: '120px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p 
                    className="text-label-uppercase"
                    style={{
                        margin: 0,
                        fontSize: '11px',
                        color: 'var(--color-muted)',
                        letterSpacing: '1px'
                    }}
                >
                    {title}
                </p>
                {description && (
                    <div style={{ position: 'relative' }} className="group">
                        <Icons.Info size={13} style={{ color: 'var(--color-muted)', cursor: 'help', opacity: 0.5 }} />
                        <div 
                            style={{
                                position: 'absolute', 
                                right: 0, 
                                bottom: '100%', 
                                marginBottom: 8,
                                width: 220, 
                                padding: 'var(--space-sm)',
                                backgroundColor: 'var(--color-surface-dark)',
                                border: '1px solid var(--color-hairline-strong)',
                                borderRadius: 'var(--radius-none)',
                                fontSize: '11px',
                                fontWeight: 300,
                                color: 'var(--color-on-dark-soft)',
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
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-xxs)', marginTop: 'auto' }}>
                <span 
                    className="text-display-sm"
                    style={{
                        color: 'var(--color-ink)',
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {isPercent ? formatVal(value, 'percent') : formatVal(value, 'number', precision)}
                </span>
                {unit && (
                    <span style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );

    const SectionHeader = ({ icon, title }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-hairline)', paddingBottom: 'var(--space-xs)' }}>
            {icon}
            <h3 className="text-title-sm" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-ink)' }}>
                {title}
            </h3>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', fontFamily: 'var(--font-family)' }}>

            {/* Efficiency */}
            <section>
                <SectionHeader
                    icon={<Icons.BarChart3 size={16} style={{ color: 'var(--color-primary)' }} />}
                    title="投資效率 (Efficiency)"
                />
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
                    <MetricCard title="夏普比率" value={displayStats["夏普比率"]} description="每單位風險換來的超額回報。> 1 代表表現良好。" />
                    <MetricCard title="索提諾比率" value={displayStats["索提諾比率"]} description="專注於下行風險的回報比。越高越好。" />
                    <MetricCard title="Calmar Ratio" value={displayStats["Calmar Ratio"]} description="年化報酬與最大回撤的比值。" />
                    <MetricCard title="年化報酬率" value={displayStats["年化報酬率"]} isPercent description="將波段報酬轉換為年度計算的收益率。" />
                </div>
            </section>

            {/* Risk */}
            <section>
                <SectionHeader
                    icon={<Icons.Shield size={16} style={{ color: 'var(--color-primary)' }} />}
                    title="風險管理 (Risk Control)"
                />
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
                    <MetricCard title="最大回撤 (MDD)" value={displayStats["最大回撤 (MDD)"]} isPercent description="從歷史最高點回落的最大幅度。越小越安全。" />
                    <MetricCard title="年化波動率" value={displayStats["年化波動率"]} isPercent description="資產價格變動的劇烈程度。" />
                </div>
            </section>

            {/* Other */}
            <section>
                <SectionHeader
                    icon={<Icons.TrendingUp size={16} style={{ color: 'var(--color-muted)' }} />}
                    title="其他指標 (Other)"
                />
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
                    <MetricCard title="歷史最高" value={displayStats["累計總值高峰"]} precision={0} description="歷史上曾達到過的最高資產總額。" />
                </div>
            </section>
        </div>
    );
};
