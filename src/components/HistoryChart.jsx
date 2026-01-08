import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Icons } from './Icons';

export const HistoryChart = ({ historyData }) => {
    if (!historyData || historyData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-neutral-500 bg-neutral-900/30 rounded-3xl border border-white/5">
                <Icons.Activity size={48} className="mb-4 opacity-50" />
                <p>尚無趨勢分析數據</p>
                <p className="text-xs mt-2 text-neutral-600">請確認同步資料中是否包含歷史數據</p>
            </div>
        );
    }

    // Custom Tooltip for professional look
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-neutral-900/90 border border-white/10 p-4 rounded-xl backdrop-blur-md shadow-2xl">
                    <p className="text-neutral-400 text-xs font-bold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4 mb-2 last:mb-0">
                            <span className="text-xs" style={{ color: entry.color }}>{entry.name}:</span>
                            <span className="text-sm font-bold text-white tabular-nums">
                                {entry.name.includes('率') || entry.name.includes('幅度')
                                    ? (Number(entry.value) * 100).toFixed(2) + '%'
                                    : Number(entry.value).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const ChartCard = ({ title, icon: Icon, children, color = "text-blue-400" }) => (
        <div className="bg-neutral-900/30 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
                <Icon size={18} className={color} />
                <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <div className="h-[250px] w-full">
                {children}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Asset Value Growth */}
            <ChartCard title="資產總額走勢" icon={Icons.TrendingUp}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#737373', fontSize: 10 }}
                            minTickGap={30}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#737373', fontSize: 10 }}
                            tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}K`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            name="總值"
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 2. Underwater Chart (Drawdown) */}
                <ChartCard title="水下圖 (Underwater Chart)" icon={Icons.TrendingDown} color="text-rose-400">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historyData}>
                            <defs>
                                <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#737373', fontSize: 10 }}
                                hide
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#737373', fontSize: 10 }}
                                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                name="回撤幅度"
                                type="monotone"
                                dataKey="drawdown"
                                stroke="#fb7185"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorDrawdown)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* 3. Efficiency Trend (Sharpe & Volatility) */}
                <ChartCard title="品質走勢 (Sharpe & Vol)" icon={Icons.Activity} color="text-purple-400">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#737373', fontSize: 10 }}
                                hide
                            />
                            <YAxis
                                yAxisId="left"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#f59e0b', fontSize: 10 }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a855f7', fontSize: 10 }}
                                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                            <Line
                                yAxisId="left"
                                name="夏普比率"
                                type="monotone"
                                dataKey="sharpe"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                yAxisId="right"
                                name="年化波動率"
                                type="monotone"
                                dataKey="volatility"
                                stroke="#a855f7"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};
