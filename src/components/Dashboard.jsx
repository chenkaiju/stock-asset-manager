import React from 'react';
import { Icons } from './Icons';
import { formatCurrency } from '../utils/formatters';

export const Dashboard = ({ data, totalValue, marketData, historyData }) => {
    // Calculate Today's Change based on most recent historical value before today
    // Calculate Today's Change based on most recent historical value before today
    // Use Taiwan time to ensure consistency with data parsing
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
        <div className="space-y-6">
            {/* Market Index Card */}
            {marketData && (
                <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-neutral-900/30 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <Icons.TrendingUp size={20} className="text-orange-500" />
                            </div>
                            <div>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Market Index</p>
                                <h3 className="text-base font-bold text-white">{marketData.name}</h3>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-4">
                            <div className="text-2xl font-bold text-white tabular-nums">
                                {marketData.index?.toLocaleString()}
                            </div>
                            <div className={`text-base font-bold flex items-center gap-1 ${marketData.change?.includes('-') ? 'text-emerald-400' : 'text-red-400'}`}>
                                {marketData.change?.includes('-') ? <Icons.ArrowDownRight size={16} /> : <Icons.ArrowUpRight size={16} />}
                                <span>{marketData.change} ({marketData.percent})</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            {/* Summary Card - Single Full Width */}
            <div className="relative p-6 md:p-8 bg-gradient-to-br from-blue-900/40 to-slate-900/40 rounded-3xl border border-blue-500/20 backdrop-blur-sm overflow-hidden">

                <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>

                <div className="relative z-10 flex flex-col justify-between h-full space-y-4 md:space-y-0">
                    <div className="flex justify-between items-center w-full">
                        <p className="text-blue-300 font-medium text-sm flex items-center gap-2">
                            <Icons.Wallet size={16} /> 總資產估值
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
                        <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
                            {formatCurrency(totalValue)}
                        </h3>
                        <div className={`flex items-center space-x-2 w-fit px-3 py-1.5 rounded-full text-xs font-semibold border ${isPositive
                            ? 'text-red-400 bg-red-400/10 border-red-400/20'
                            : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                            }`}>
                            {isPositive ? <Icons.ArrowUpRight size={14} /> : <Icons.ArrowDownRight size={14} />}
                            <span>
                                {isPositive ? '+' : ''}{Math.round(todayChange).toLocaleString()}
                                &nbsp;({isPositive ? '+' : ''}{todayChangePercent.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Performance Section */}
            <section>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Icons.TrendingUp size={18} className="text-blue-400" />
                    <span>主要持股</span>
                    <span className="text-xs font-normal text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-lg border border-white/5">
                        共 {data.length} 檔
                    </span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...data].sort((a, b) => b.市值 - a.市值).slice(0, 10).map((stock) => (
                        <div
                            key={stock.代號}
                            className="flex items-center justify-between p-4 bg-neutral-900/30 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer group active:scale-[0.98]"
                        >
                            {/* Left: Identity */}
                            <div className="flex items-center space-x-3 w-[30%]">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-sm shadow-lg shrink-0">
                                    {stock.股票名稱[0]}
                                </div>
                                <div className="min-w-0">
                                    <h5 className="font-bold text-sm md:text-base truncate">{stock.股票名稱}</h5>
                                    <p className="text-xs text-neutral-500">{stock.代號}</p>
                                </div>
                            </div>

                            {/* Center: Market Data (Price & Change) */}
                            <div className="flex flex-col items-center justify-center w-[35%]">
                                <p className={`text-sm md:text-base font-bold ${stock.當日漲跌 >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {stock.現價?.toLocaleString()}
                                </p>
                                <div className={`flex items-center gap-1 text-xs font-medium ${stock.當日漲跌 >= 0 ? 'text-red-400/80' : 'text-emerald-400/80'}`}>
                                    <span>{stock.當日漲跌 > 0 ? '+' : ''}{Number(stock.當日漲跌).toFixed(2)}</span>
                                    <span>({Number(stock.當日漲跌幅).toFixed(2)}%)</span>
                                </div>
                            </div>

                            {/* Right: Asset Details (Value & Qty) */}
                            <div className="text-right w-[35%] pl-2">
                                <p className="font-bold text-sm md:text-base text-white">
                                    {formatCurrency(stock.市值)}
                                </p>
                                <p className="text-xs text-neutral-500 mt-0.5">
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
