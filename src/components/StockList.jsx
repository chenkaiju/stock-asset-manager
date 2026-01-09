import React from 'react';
import { Icons } from './Icons';
import { formatCurrency } from '../utils/formatters';

export const StockList = ({ data }) => {
    const [sortConfig, setSortConfig] = React.useState({ key: '代號', direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [data, sortConfig]);

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return <div className="w-4 h-4" />; // Placeholder
        return sortConfig.direction === 'asc'
            ? <Icons.ArrowUp size={14} className="text-blue-400" />
            : <Icons.ArrowDown size={14} className="text-blue-400" />;
    };

    // Sortable Header Component
    const SortableHeader = ({ label, sortKey, align = "left" }) => (
        <th
            className={`px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors select-none ${align === "right" ? "text-right" : "text-left"}`}
            onClick={() => handleSort(sortKey)}
        >
            <div className={`flex items-center gap-1 ${align === "right" ? "justify-end" : "justify-start"}`}>
                {label}
                <SortIcon columnKey={sortKey} />
            </div>
        </th>
    );

    return (
        <div className="pb-8">
            {/* Mobile Card View (Sorted) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
                {/* Mobile Sort Controls */}
                <div className="flex gap-2 mb-2 overflow-x-auto pb-2 no-scrollbar">
                    {[
                        { label: '預設 (代號)', key: '代號' },
                        { label: '市值', key: '市值' },
                        { label: '股價', key: '現價' },
                        { label: '股數', key: '股數' },
                    ].map((option) => (
                        <button
                            key={option.key}
                            onClick={() => handleSort(option.key)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${sortConfig.key === option.key
                                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                    : 'bg-neutral-800 text-neutral-400 border-transparent hover:bg-neutral-700'
                                }`}
                        >
                            {option.label}
                            {sortConfig.key === option.key && (
                                sortConfig.direction === 'asc'
                                    ? <Icons.ArrowUp size={12} />
                                    : <Icons.ArrowDown size={12} />
                            )}
                        </button>
                    ))}
                </div>

                {sortedData.map((stock) => (
                    <div key={stock.代號} className="bg-neutral-900/30 p-4 rounded-2xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neutral-800 rounded-lg">
                                    <Icons.Building2 size={18} className="text-neutral-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{stock.股票名稱}</h3>
                                    <p className="text-xs text-neutral-500">{stock.代號}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-mono font-bold text-lg">{formatCurrency(stock.市值)}</p>
                                <p className="text-xs text-neutral-500">總市值</p>
                            </div>
                        </div>
                        <div className="h-px bg-white/5 w-full"></div>
                        <div className="flex justify-between text-sm">
                            <div>
                                <span className="text-neutral-500 text-xs block">持有股數</span>
                                <span className="font-medium">{stock.股數}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-neutral-500 text-xs block">目前股價</span>
                                <span className="font-medium text-blue-400">{stock.現價}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/20">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-neutral-400 text-sm">
                            <th
                                className="px-6 py-4 font-medium cursor-pointer hover:text-white transition-colors select-none"
                                onClick={() => handleSort(sortConfig.key === '代號' ? '股票名稱' : '代號')}
                            >
                                <div className="flex items-center gap-1">
                                    名稱 / 代號
                                    {(sortConfig.key === '代號' || sortConfig.key === '股票名稱') && (
                                        sortConfig.direction === 'asc'
                                            ? <Icons.ArrowUp size={14} className="text-blue-400" />
                                            : <Icons.ArrowDown size={14} className="text-blue-400" />
                                    )}
                                </div>
                            </th>
                            <SortableHeader label="持有股數" sortKey="股數" />
                            <SortableHeader label="目前股價" sortKey="現價" />
                            <SortableHeader label="總市值" sortKey="市值" align="right" />
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sortedData.map((stock) => (
                            <tr key={stock.代號} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-300">
                                            {stock.股票名稱[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{stock.股票名稱}</div>
                                            <div className="text-xs text-neutral-500">{stock.代號}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-neutral-300">{stock.股數}</td>
                                <td className="px-6 py-4 text-sm font-medium text-blue-400">{stock.現價}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="font-bold">{formatCurrency(stock.市值)}</div>
                                </td>
                                <td className="px-6 py-4 text-right text-neutral-600">
                                    <Icons.ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
