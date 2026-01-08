import React from 'react';
import { Icons } from './Icons';

export const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212] border-t border-white/10 md:top-0 md:bottom-0 md:right-auto md:w-64 md:border-t-0 md:border-r md:flex md:flex-col p-2 md:p-6 shadow-2xl md:shadow-none">
            <div className="hidden md:block mb-10 px-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
                    <Icons.Wallet className="text-blue-400" /> AssetFlow
                </h1>
                <p className="text-xs text-neutral-500 mt-2 pl-1">Stock Portfolio Tracker</p>
            </div>

            <div className="flex justify-around md:flex-col md:space-y-2">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-4 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === 'dashboard'
                        ? 'text-blue-400 bg-blue-400/10'
                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                        }`}
                >
                    <Icons.LayoutDashboard size={20} className="md:w-6 md:h-6" />
                    <span className="text-[10px] md:text-base font-medium">概覽</span>
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-4 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === 'history'
                        ? 'text-blue-400 bg-blue-400/10'
                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                        }`}
                >
                    <Icons.TrendingUp size={20} className="md:w-6 md:h-6" />
                    <span className="text-[10px] md:text-base font-medium">歷史走勢</span>
                </button>
                <button
                    onClick={() => setActiveTab('list')}
                    className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-4 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === 'list'
                        ? 'text-blue-400 bg-blue-400/10'
                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                        }`}
                >
                    <Icons.List size={20} className="md:w-6 md:h-6" />
                    <span className="text-[10px] md:text-base font-medium">持股清單</span>
                </button>
                <button
                    onClick={() => setActiveTab('datasource')}
                    className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-4 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === 'datasource'
                        ? 'text-blue-400 bg-blue-400/10'
                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                        }`}
                >
                    <Icons.Database size={20} className="md:w-6 md:h-6" />
                    <span className="text-[10px] md:text-base font-medium">資料來源</span>
                </button>
                <button
                    onClick={() => setActiveTab('performance')}
                    className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-4 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === 'performance'
                        ? 'text-blue-400 bg-blue-400/10'
                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                        }`}
                >
                    <Icons.Activity size={20} className="md:w-6 md:h-6" />
                    <span className="text-[10px] md:text-base font-medium">績效分析</span>
                </button>
            </div>
        </nav>
    );
};
