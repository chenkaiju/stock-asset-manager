import React from 'react';
import { Icons } from './Icons';

export const Header = ({ loading, sheetUrl, setSheetUrl, error }) => {
    return (
        <>
            <header className="flex flex-col md:flex-row justify-end items-start md:items-center mb-8 gap-4">
                <div className="flex w-full md:w-auto gap-2">
                    <input
                        type="text"
                        placeholder="連結 Google Apps Script..."
                        className="bg-neutral-900/50 border border-neutral-800 text-white rounded-xl px-4 py-2.5 text-sm w-full md:w-72 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
                        value={sheetUrl}
                        onChange={(e) => setSheetUrl(e.target.value)}
                    />
                    <button
                        title="重新整理"
                        onClick={() => setSheetUrl(sheetUrl)}
                        disabled={loading}
                        className="p-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl border border-neutral-700 transition-all shrink-0 active:scale-95 disabled:opacity-50"
                    >
                        <Icons.RefreshedCcw size={20} className={`text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-2 text-sm">
                    <span>⚠️</span>
                    <span>連線錯誤: {error}。請檢查 URL。</span>
                </div>
            )}
        </>
    );
};
