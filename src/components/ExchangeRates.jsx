import React from 'react';
import { Icons } from './Icons';

export const ExchangeRates = ({ rates, loading }) => {
    if (loading && (!rates || Object.keys(rates).length === 0)) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-neutral-500">
                <Icons.RefreshedCcw size={48} className="mb-4 animate-spin opacity-50" />
                <p>Loading Exchange Rates...</p>
            </div>
        );
    }

    const currencies = [
        { code: 'USD', name: '美金', flag: 'us' },
        { code: 'EUR', name: '歐元', flag: 'eu' },
        { code: 'JPY', name: '日圓', flag: 'jp' },
        { code: 'CNY', name: '人民幣', flag: 'cn' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Icons.Globe size={24} className="text-blue-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                        匯率資訊
                    </h2>
                    <p className="text-xs text-neutral-500">即時匯率 (兌台幣 TWD)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currencies.map((currency) => {
                    const rateData = rates ? rates[currency.code] : null;
                    const price = rateData?.price;
                    const change = rateData?.change;
                    const percent = rateData?.percent;
                    const isPositive = change && parseFloat(change) >= 0;

                    return (
                        <div key={currency.code} className="p-6 bg-neutral-900/30 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden border-2 border-neutral-700/50 flex-shrink-0">
                                        <img
                                            src={`https://flagcdn.com/w80/${currency.flag}.png`}
                                            alt={currency.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{currency.code}</div>
                                        <div className="text-xs text-neutral-500">{currency.name}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
                                    {price ? price.toFixed(currency.code === 'JPY' ? 4 : 2) : '--'}
                                </div>
                                <div className={`text-sm font-medium flex items-center gap-1 ${isPositive ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {change ? (
                                        <>
                                            {isPositive ? <Icons.TrendingUp size={14} /> : <Icons.TrendingDown size={14} />}
                                            <span>{change > 0 ? '+' : ''}{change.toFixed(4)} ({percent})</span>
                                        </>
                                    ) : (
                                        <span className="text-neutral-600">--</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200 text-xs flex items-center gap-3">
                <Icons.Info size={16} className="shrink-0" />
                <p>資料來源：Yahoo Finance。報價可能會有延遲，僅供參考。</p>
            </div>
        </div>
    );
};
