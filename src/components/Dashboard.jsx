import React from 'react';
import { Icons } from './Icons';
import { formatCurrency } from '../utils/formatters';

export const Dashboard = ({ data, totalValue }) => {
    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            {/* Summary Card - Single Full Width */}
            <div className="relative p-6 md:p-8 bg-gradient-to-br from-blue-900/40 to-slate-900/40 rounded-3xl border border-blue-500/20 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <p className="text-blue-300 font-medium text-sm flex items-center gap-2">
                            <Icons.Wallet size={16} /> 總資產估值
                        </p>
                        <h3 className="text-4xl md:text-6xl font-bold mt-4 tracking-tight text-white">
                            {formatCurrency(totalValue)}
                        </h3>
                        <div className="flex items-center space-x-2 mt-4 text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-400/20">
                            <Icons.ArrowUpRight size={14} />
                            <span>2.4% 今日上漲</span>
                        </div>
                    </div>

                    <div className="bg-white/5 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                        <p className="text-neutral-400 text-xs mb-1">持股數量</p>
                        <p className="text-2xl font-bold text-white leading-none">
                            {data.length} <span className="text-sm text-neutral-500 font-normal">檔</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Performance Section */}
            <section>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Icons.TrendingUp size={18} className="text-blue-400" />
                    主要持股
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...data].sort((a, b) => b.市值 - a.市值).slice(0, 10).map((stock) => (
                        <div
                            key={stock.代號}
                            className="flex items-center justify-between p-4 bg-neutral-900/30 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer group active:scale-[0.98]"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-sm shadow-lg">
                                    {stock.股票名稱[0]}
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm md:text-base">{stock.股票名稱}</h5>
                                    <p className="text-xs text-neutral-500">{stock.代號}</p>
                                </div>
                            </div>
                            <div className="text-right space-y-0.5">
                                <p className="text-sm font-medium text-neutral-300">
                                    {stock.現價?.toLocaleString()} <span className="text-xs text-neutral-500">| {stock.股數?.toLocaleString()} 股</span>
                                </p>
                                <p className="font-bold text-sm md:text-base text-blue-400">
                                    {formatCurrency(stock.市值)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
