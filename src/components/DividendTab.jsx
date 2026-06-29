import { useState, useEffect, useCallback } from 'react';
import { fetchWithProxy, fetchTextWithProxy } from '../utils/api';
import { Icons } from './Icons';

const fmt = (n, digits = 2) =>
    n == null ? '--' : n.toLocaleString('zh-TW', { minimumFractionDigits: digits, maximumFractionDigits: digits });

/**
 * Parse the `root.App.main = {...}` JSON block from Yahoo 奇摩股市 HTML
 * and extract the dividends array from QuoteDividendStore.
 */
function parseYahooTWDividends(html) {
    const startMarker = 'root.App.main = ';
    const startIdx = html.indexOf(startMarker);
    if (startIdx === -1) return null;

    let jsonText = '';
    let braceCount = 0;
    let started = false;

    for (let i = startIdx + startMarker.length; i < html.length; i++) {
        const char = html[i];
        if (char === '{') { braceCount++; started = true; }
        else if (char === '}') { braceCount--; }
        jsonText += char;
        if (started && braceCount === 0) break;
    }

    const parsedData = JSON.parse(
        jsonText
            .replace(/:\s*undefined\b/g, ': null')
            .replace(/:\s*NaN\b/g, ': null')
    );

    const stores = parsedData?.context?.dispatcher?.stores;
    const qs = stores?.QuoteDividendStore;
    const dataKey = qs?.dividendDataKey;
    const dividendData = qs?.[dataKey];

    return dividendData?.data?.dividends ?? null;
}

export const DividendTab = ({ data }) => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({ done: 0, total: 0, errors: 0 });
    const [lastFetched, setLastFetched] = useState(null);
    const [copied, setCopied] = useState(false);

    const fetchDividends = useCallback(async () => {
        if (!data || data.length === 0) return;
        setLoading(true);
        setRows([]);
        setProgress({ done: 0, total: data.length, errors: 0 });

        // Use Taiwan date (UTC+8) for all date comparisons
        const nowTW = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
        const todayTW = new Date(nowTW.getFullYear(), nowTW.getMonth(), nowTW.getDate()); // midnight today TW
        const currentYear = nowTW.getFullYear();
        let done = 0;
        let errors = 0;

        const promises = data.map(async (stock) => {
            const raw = String(stock['代號'] || '').trim();
            // Mirror the same normalization used in useStockData.js
            const symbol = (!raw.includes('.') && /^[0-9]{4,6}[A-Z]?$/.test(raw))
                ? `${raw}.TW`
                : raw;

            const isTaiwanStock = symbol.endsWith('.TW') || symbol.endsWith('.TWO') || /^[0-9]{4,6}$/.test(raw);
            const stockCode = raw.replace(/\.(TW|TWO)$/i, '');

            try {
                if (isTaiwanStock) {
                    // ── Primary source: Yahoo 奇摩股市HTML ──
                    // This page returns ISO-date strings and includes cashPayDate.
                    // The URL works for both .TW (listed) and .TWO (OTC) stocks.
                    const twUrl = `https://tw.stock.yahoo.com/quote/${stockCode}/dividend`;
                    const html = await fetchTextWithProxy(twUrl);
                    const twDividends = parseYahooTWDividends(html);

                    if (!twDividends) return [];

                    // Only keep individual distribution events with:
                    //   - a real ex-date in the current year
                    //   - ex-date <= today (Taiwan time) — future dates are hidden until they arrive
                    // (Note: we don't check for recordType === 'SUB' because single-annual-dividend
                    // stocks only have 'YEAR' records, while ETFs have both 'YEAR' (without dates) and 'SUB' (with dates))
                    const yearRows = twDividends.filter((d) => {
                        const exStr = d.exDate || d.exDividend?.date || d.exRight?.date;
                        if (!exStr) return false;
                        const exD = new Date(exStr);
                        if (exD.getFullYear() !== currentYear) return false;
                        // Compare date-only (strip time) against today TW midnight
                        const exMidnight = new Date(exD.getFullYear(), exD.getMonth(), exD.getDate());
                        return exMidnight <= todayTW; // hide future ex-dates
                    });

                    return yearRows.map((d) => {
                        const exStr = d.exDate || d.exDividend?.date || d.exRight?.date;
                        const exDateObj = new Date(exStr);
                        const exDateFmt = exDateObj.toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' });

                        const payStr = d.exDividend?.cashPayDate || d.exRight?.stockPayDate;
                        let payDateFmt = null;
                        if (payStr) {
                            const pDate = new Date(payStr);
                            if (!isNaN(pDate.getTime())) {
                                payDateFmt = pDate.toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' });
                            }
                        }

                        const cashAmount = parseFloat(d.exDividend?.cash) || null;

                        let stockDividend = null;
                        if (d.exRight?.stock && d.exRight.stock !== '-') {
                            const stockVal = parseFloat(d.exRight.stock);
                            if (!isNaN(stockVal) && stockVal > 0) {
                                stockDividend = stockVal / 10; // convert to per-share
                            }
                        }

                        // Check if ex-date is today (Taiwan time)
                        const exMidnight = new Date(exDateObj.getFullYear(), exDateObj.getMonth(), exDateObj.getDate());
                        const isToday = exMidnight.getTime() === todayTW.getTime();

                        return {
                            名稱: stock['股票名稱'],
                            代號: raw,
                            現金股利: cashAmount,
                            股票股利: stockDividend,
                            exDate: exDateFmt,
                            payDate: payDateFmt,
                            isToday,
                            exTs: exDateObj.getTime() / 1000,
                        };
                    });

                } else {
                    // ── Fallback for non-TW stocks: Yahoo Finance v8 Chart API ──
                    // Pay dates are not available for non-TW stocks.
                    let json = null;
                    try {
                        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=ytd&interval=1d&events=div`;
                        json = await fetchWithProxy(url);
                    } catch (e) {
                        console.warn(`[DividendTab] Yahoo v8 查詢失敗 ${symbol}:`, e);
                    }

                    if (!json) return [];
                    const result = json?.chart?.result?.[0];
                    const dividends = result?.events?.dividends;
                    if (!dividends) return [];

                    return Object.values(dividends).map((div) => {
                        const exDateObj = new Date(div.date * 1000);
                        return {
                            名稱: stock['股票名稱'],
                            代號: raw,
                            現金股利: div.amount,
                            股票股利: null,
                            exDate: exDateObj.toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' }),
                            payDate: null,
                            exTs: div.date,
                        };
                    });
                }
            } catch (e) {
                errors += 1;
                console.warn(`[DividendTab] 查詢失敗 ${symbol}:`, e);
                return [];
            } finally {
                done += 1;
                setProgress({ done, total: data.length, errors });
            }
        });

        const settled = await Promise.allSettled(promises);
        const allRows = settled
            .filter((r) => r.status === 'fulfilled')
            .flatMap((r) => r.value);

        allRows.sort((a, b) => b.exTs - a.exTs);
        setRows(allRows);
        setLastFetched(new Date());
        setLoading(false);
    }, [data]);

    useEffect(() => {
        fetchDividends();
    }, [fetchDividends]);

    const handleCopy = () => {
        if (rows.length === 0) return;
        const header = ['除息日', '入帳日', '名稱', '代號', '現金股利/股', '股票股利/股'].join('\t');
        const body = rows
            .map((r) =>
                [
                    r.exDate,
                    r.payDate ?? '',
                    r.名稱,
                    r.代號,
                    r.現金股利 ?? '',
                    r.股票股利 != null ? fmt(r.股票股利, 4) : '',
                ].join('\t')
            )
            .join('\n');
        navigator.clipboard.writeText(header + '\n' + body).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const cellStyle = {
        padding: '10px 12px',
        borderBottom: '1px solid var(--color-hairline)',
        fontSize: '13px',
        color: 'var(--color-ink)',
        whiteSpace: 'nowrap',
    };
    const headStyle = {
        ...cellStyle,
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.8px',
        textTransform: 'uppercase',
        color: 'var(--color-muted)',
        backgroundColor: 'var(--color-surface-soft)',
        borderBottom: '2px solid var(--color-hairline)',
    };

    const year = new Date().getFullYear();

    return (
        <div style={{ fontFamily: 'var(--font-family)' }}>
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-lg)',
                    flexWrap: 'wrap',
                    gap: 'var(--space-sm)',
                }}
            >
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--color-ink)' }}>
                        除權息紀錄
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-muted)' }}>
                        持股中 {year} 年度除息／除權事件．資料來源：Yahoo 奇摩股市
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                    {lastFetched && (
                        <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                            更新於 {lastFetched.toLocaleTimeString('zh-TW')}
                        </span>
                    )}
                    <button
                        onClick={fetchDividends}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            background: 'transparent',
                            border: '1px solid var(--color-hairline)',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: loading ? 'var(--color-muted)' : 'var(--color-ink)',
                            fontFamily: 'var(--font-family)',
                        }}
                    >
                        <Icons.RefreshCw size={14} style={{ opacity: loading ? 0.4 : 1 }} />
                        重新整理
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={rows.length === 0}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            background: rows.length > 0 ? 'var(--color-primary)' : 'var(--color-surface-soft)',
                            border: 'none',
                            cursor: rows.length > 0 ? 'pointer' : 'not-allowed',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: rows.length > 0 ? '#fff' : 'var(--color-muted)',
                            letterSpacing: '0.5px',
                            fontFamily: 'var(--font-family)',
                        }}
                    >
                        {copied ? '✓ 已複製' : '複製 Excel'}
                    </button>
                </div>
            </div>

            {/* Loading progress */}
            {loading && (
                <div style={{ marginBottom: 'var(--space-md)' }}>
                    <div style={{ height: '3px', backgroundColor: 'var(--color-hairline)', overflow: 'hidden' }}>
                        <div
                            style={{
                                height: '100%',
                                width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%`,
                                backgroundColor: 'var(--color-primary)',
                                transition: 'width 0.2s ease',
                            }}
                        />
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--color-muted)' }}>
                        查詢中… {progress.done} / {progress.total} 檔
                        {progress.errors > 0 && (
                            <span style={{ color: 'var(--color-danger, #c0392b)', marginLeft: '8px' }}>
                                （{progress.errors} 筆失敗，詳見 Console）
                            </span>
                        )}
                    </p>
                </div>
            )}

            {/* Empty state */}
            {!loading && rows.length === 0 && (
                <div
                    style={{
                        padding: 'var(--space-xl) var(--space-lg)',
                        textAlign: 'center',
                        border: '1px solid var(--color-hairline)',
                        backgroundColor: 'var(--color-surface-soft)',
                    }}
                >
                    <Icons.Banknote size={32} style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-sm)' }} />
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-muted)' }}>
                        {year} 年度尚無除息紀錄
                    </p>
                    {progress.errors > 0 && (
                        <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--color-danger, #c0392b)' }}>
                            {progress.errors} 檔查詢失敗，請開啟 F12 Console 查看詳細錯誤
                        </p>
                    )}
                </div>
            )}

            {/* Table */}
            {rows.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--color-hairline)' }}>
                        <thead>
                            <tr>
                                {[
                                    { label: '除息日', align: 'right' },
                                    { label: '入帳日', align: 'right' },
                                    { label: '名稱', align: 'left' },
                                    { label: '代號', align: 'right' },
                                    { label: '現金股利/股', align: 'right' },
                                    { label: '股票股利/股', align: 'right' },
                                ].map(({ label, align }) => (
                                    <th key={label} style={{ ...headStyle, textAlign: align }}>
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => {
                                const todayRowStyle = r.isToday
                                    ? {
                                        backgroundColor: 'rgba(251, 191, 36, 0.12)', // amber-200 tint
                                        borderLeft: '3px solid #f59e0b',             // amber-500 accent
                                        boxShadow: 'inset 0 0 0 1px rgba(251,191,36,0.25)',
                                    }
                                    : {
                                        backgroundColor: i % 2 === 0 ? 'var(--color-canvas)' : 'var(--color-surface-soft)',
                                        borderLeft: '3px solid transparent',
                                    };

                                return (
                                    <tr key={i} style={todayRowStyle}>
                                        <td style={{ ...cellStyle, textAlign: 'right', fontSize: '12px',
                                            color: r.isToday ? '#92400e' : 'var(--color-muted)' }}>
                                            {r.isToday && (
                                                <span style={{
                                                    display: 'inline-block',
                                                    marginRight: '6px',
                                                    padding: '1px 6px',
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.5px',
                                                    backgroundColor: '#f59e0b',
                                                    color: '#fff',
                                                    borderRadius: '3px',
                                                    verticalAlign: 'middle',
                                                }}>
                                                    今日
                                                </span>
                                            )}
                                            {r.exDate}
                                        </td>
                                        <td style={{ ...cellStyle, textAlign: 'right', color: 'var(--color-muted)', fontSize: '12px' }}>
                                            {r.payDate ?? '--'}
                                        </td>
                                        <td style={{ ...cellStyle, textAlign: 'left',
                                            fontWeight: r.isToday ? 700 : 600,
                                            color: r.isToday ? '#92400e' : 'var(--color-ink)' }}>
                                            {r.名稱}
                                        </td>
                                        <td style={{ ...cellStyle, textAlign: 'right', fontFamily: 'monospace',
                                            color: r.isToday ? '#b45309' : 'var(--color-muted)' }}>
                                            {r.代號}
                                        </td>
                                        <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 700,
                                            color: r.isToday ? '#b45309' : 'var(--color-primary)' }}>
                                            {fmt(r.現金股利)}
                                        </td>
                                        <td style={{ ...cellStyle, textAlign: 'right',
                                            color: r.股票股利 != null
                                                ? (r.isToday ? '#b45309' : 'var(--color-primary)')
                                                : 'var(--color-muted)' }}>
                                            {r.股票股利 != null ? fmt(r.股票股利, 4) : '--'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <p style={{ marginTop: 'var(--space-md)', fontSize: '11px', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                ※ 台股除息日、入帳日與股票股利資料來自 Yahoo 奇摩股市（上市、上櫃均支援）；美股及其他市場股票不提供入帳日，顯示為 --。
            </p>
        </div>
    );
};
