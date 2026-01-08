import React from 'react';
import { Icons } from './Icons';

export const DataSource = ({ sheetUrl, setSheetUrl, error, loading, refresh }) => {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-neutral-900/30 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <Icons.Database className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">資料來源設定</h2>
                        <p className="text-sm text-neutral-500">串接您的 Google Apps Script 以獲取即時資料</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-neutral-400 ml-1">
                        Google Apps Script Web App URL
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="https://script.google.com/macros/s/..."
                            className="flex-1 bg-neutral-950 border border-white/10 text-white rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                            value={sheetUrl}
                            onChange={(e) => setSheetUrl(e.target.value)}
                        />
                        <button
                            onClick={refresh}
                            disabled={loading || !sheetUrl}
                            className="px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2 shrink-0 shadow-lg shadow-blue-500/20"
                        >
                            <Icons.RefreshedCcw size={18} className={loading ? 'animate-spin' : ''} />
                            {loading ? '同步中...' : '立即同步'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                        <span className="text-lg">⚠️</span>
                        <div>
                            <p className="font-bold">連線失敗</p>
                            <p className="opacity-80">{error}</p>
                        </div>
                    </div>
                )}

                {!error && sheetUrl && !loading && (
                    <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p>連線正常：已成功串接資料來源</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                        <span className="text-blue-400">01.</span> 部署 GAS 程式
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        請將 <code>backend/Code.js</code> 的內容複製到 Google Apps Script 編輯器，並部署為「網路應用程式」。
                    </p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                        <span className="text-blue-400">02.</span> 取得網址
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        部署後的網址格式為 <code>https://script.google.com/macros/s/.../exec</code>。
                    </p>
                </div>
            </div>
        </div>
    );
};
