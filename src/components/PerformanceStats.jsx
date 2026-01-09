import React from 'react';
import { Icons } from './Icons';

export const PerformanceStats = ({ stats }) => {
    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-neutral-500 bg-neutral-900/30 rounded-3xl border border-white/5">
                <Icons.Activity size={48} className="mb-4 opacity-50" />
                <p>尚無績效統計數據</p>
                <p className="text-xs mt-2 text-neutral-600">請確認 "歷史現值" 中是否已包含統計欄位</p>
            </div>
        );
    }

    const formatVal = (val, type = 'number') => {
        if (val === undefined || val === null || val === '') return '--';
        const num = Number(val);
        if (isNaN(num)) return val; // Return raw if not a number

        if (type === 'percent') {
            const prefix = num > 0 ? '+' : '';
            return `${prefix}${(num * 100).toFixed(2)}%`;
        }
        return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    };

    const MetricCard = ({ title, value, unit, description, isPercent = false }) => (
        <div className="p-5 bg-neutral-900/30 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{title}</h4>
                {description && (
                    <div className="group relative">
                        <Icons.Info size={14} className="text-neutral-600 cursor-help" />
                        <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-neutral-800 text-[10px] text-neutral-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-white/10 shadow-xl">
                            {description}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-baseline gap-1 mt-1">
                <h4 className="text-3xl font-bold text-white tabular-nums tracking-tight">
                    {isPercent ? formatVal(value, 'percent') : formatVal(value)}
                </h4>
                {unit && <span className="text-xs text-neutral-500">{unit}</span>}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Efficiency Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Icons.BarChart3 size={18} className="text-blue-400" />
                    <h3 className="text-lg font-bold text-white">投資效率 (Efficiency)</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard
                        title="夏普比率"
                        value={stats["夏普比率"]}
                        description="每單位風險換來的超額回報。> 1 代表表現良好。"
                    />
                    <MetricCard
                        title="索提諾比率"
                        value={stats["索提諾比率"]}
                        description="專注於下行風險的回報比。越高越好。"
                    />
                    <MetricCard
                        title="Calmar Ratio"
                        value={stats["Calmar Ratio"]}
                        description="年化報酬與最大回撤的比值。"
                    />
                    <MetricCard
                        title="年化報酬率"
                        value={stats["年化報酬率"]}
                        isPercent={true}
                        description="將波段報酬轉換為年度計算的收益率。"
                    />
                </div>
            </section>

            {/* Risk Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Icons.Shield size={18} className="text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">風險管理 (Risk Control)</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard
                        title="最大回撤 (MDD)"
                        value={stats["最大回撤 (MDD)"]}
                        isPercent={true}
                        description="從歷史最高點回落的最大幅度。越小越安全。"
                    />

                    <MetricCard
                        title="年化波動率"
                        value={stats["年化波動率"]}
                        isPercent={true}
                        description="資產價格變動的劇烈程度。"
                    />

                </div>
            </section>

            {/* Other Metrics */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Icons.TrendingUp size={18} className="text-neutral-400" />
                    <h3 className="text-lg font-bold text-white">其他指標 (Other)</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    <MetricCard
                        title="歷史最高"
                        value={stats["累計總值高峰"]}
                        description="歷史上曾達到過的最高資產總額。"
                    />
                </div>
            </section>
        </div>
    );
};
