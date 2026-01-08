import React from 'react';
import { Icons } from './Icons';

export const Header = ({ loading, sheetUrl, setSheetUrl, error }) => {
    return (
        <>
            <header className="mb-8">
                {loading && (
                    <div className="flex items-center gap-2 text-blue-400 text-sm font-medium animate-pulse">
                        <Icons.RefreshedCcw size={16} className="animate-spin" />
                        正在同步資料...
                    </div>
                )}
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
