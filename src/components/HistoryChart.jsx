import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { Icons } from './Icons';

export const HistoryChart = ({ historyData }) => {
    if (!historyData || historyData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-neutral-500 bg-neutral-900/30 rounded-3xl border border-white/5">
                <Icons.TrendingUp size={48} className="mb-4 opacity-50" />
                <p>尚無歷史數據</p>
                <p className="text-xs mt-2 text-neutral-600">請確認 Google Sheet 中是否已有 "歷史現值" 資料</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Chart Container */}
            <div className="p-6 md:p-8 bg-neutral-900/30 rounded-3xl border border-white/5 backdrop-blur-sm relative">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Icons.TrendingUp size={20} className="text-blue-400" />
                            資產成長曲線
                        </h3>
                        <p className="text-sm text-neutral-400 mt-1">追蹤您的總資產歷史變化</p>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#737373', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                tick={{ fill: '#737373', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${(value / 10000).toFixed(0)}萬`}
                                width={60}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(8px)'
                                }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ color: '#a3a3a3', marginBottom: '4px' }}
                                formatter={(value) => [formatCurrency(value), '總資產']}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>


            </div>
        </div>
    );
};
