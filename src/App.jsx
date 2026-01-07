import { useState, useEffect } from 'react';

// Inline Icons to avoid build issues
const Icons = {
  Wallet: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  ),
  LayoutDashboard: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  List: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  ),
  TrendingUp: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  RefreshedCcw: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  ),
  ArrowUpRight: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  ),
  ChevronRight: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  Building2: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
};

// Mock Data
const MOCK_DATA = [
  { "股票名稱": "台積電", "代號": "2330.TW", "股數": 1000, "現價": 620, "市值": 620000 },
  { "股票名稱": "鴻海", "代號": "2317.TW", "股數": 2000, "現價": 105, "市值": 210000 },
  { "股票名稱": "聯發科", "代號": "2454.TW", "股數": 500, "現價": 980, "市值": 490000 },
  { "股票名稱": "NVIDIA", "代號": "NVDA", "股數": 50, "現價": 550, "市值": 852500 },
];

const SHEET_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"; // User will replace this

const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function App() {
  const [data, setData] = useState(MOCK_DATA);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sheetUrl, setSheetUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sheetUrl) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(sheetUrl);
        if (!response.ok) throw new Error('Failed to fetch data');
        const jsonData = await response.json();

        // Basic normalization to ensure numbers are numbers
        const normalizedData = jsonData.map(item => {
          const quantity = Number(item["股數"]) || 0;
          const price = Number(item["股價"]) || 0; // User column: 股價
          const marketValue = Number(item["個股現值"]) || (quantity * price); // User column: 個股現值

          return {
            ...item,
            // Internal App Keys mapped from Sheet Columns
            "股票名稱": item["股名"] || item["股票名稱"] || "Unknown", // User column: 股名
            "代號": item["股票代碼"] || item["代號"] || "0000", // User column: 股票代碼
            "股數": quantity,
            "現價": price,
            "市值": marketValue,
          };
        });

        setData(normalizedData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sheetUrl]);

  const totalValue = data.reduce((acc, curr) => acc + curr.市值, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 md:pb-0 md:pl-64 font-sans">
      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
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
            onClick={() => setActiveTab('list')}
            className={`flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-4 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === 'list'
              ? 'text-blue-400 bg-blue-400/10'
              : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
              }`}
          >
            <Icons.List size={20} className="md:w-6 md:h-6" />
            <span className="text-[10px] md:text-base font-medium">持股清單</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-10 pt-8 md:pt-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              我的資產
              {loading && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>}
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              {loading ? '資料更新中...' : `最後更新於：${new Date().toLocaleTimeString()}`}
            </p>
          </div>

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

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div
                className="p-6 md:p-8 bg-gradient-to-br from-blue-900/40 to-slate-900/40 rounded-3xl border border-blue-500/20 backdrop-blur-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
                <p className="text-blue-300 font-medium text-sm flex items-center gap-2">
                  <Icons.Wallet size={16} /> 總資產估值
                </p>
                <h3 className="text-3xl md:text-5xl font-bold mt-4 tracking-tight text-white">{formatCurrency(totalValue)}</h3>
                <div className="flex items-center space-x-2 mt-4 text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-400/20">
                  <Icons.ArrowUpRight size={14} />
                  <span>2.4% 今日上漲</span>
                </div>
              </div>

              <div
                className="p-6 md:p-8 bg-neutral-900/30 rounded-3xl border border-white/5 backdrop-blur-sm flex flex-col justify-between"
              >
                <div>
                  <p className="text-neutral-400 font-medium text-sm">持股檔數</p>
                  <h3 className="text-3xl md:text-4xl font-bold mt-2 tracking-tight">{data.length} <span className="text-lg text-neutral-500">檔</span></h3>
                </div>
                <div className="flex -space-x-3 mt-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-[#0a0a0a] flex items-center justify-center text-xs font-bold text-neutral-300 shadow-lg">
                      {data[i - 1]?.股票名稱[0]}
                    </div>
                  ))}
                  {data.length > 3 && (
                    <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-[#0a0a0a] flex items-center justify-center text-xs text-neutral-500">
                      +{data.length - 3}
                    </div>
                  )}
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
                {data.slice(0, 4).map((stock) => (
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
                    <div className="text-right">
                      <p className="font-bold text-sm md:text-base">{formatCurrency(stock.現價)}</p>
                      <p className="text-xs text-neutral-500">
                        {stock.股數} 股
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="pb-8">
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {data.map((stock) => (
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
                    <th className="px-6 py-4 font-medium">名稱 / 代號</th>
                    <th className="px-6 py-4 font-medium">持有股數</th>
                    <th className="px-6 py-4 font-medium">目前股價</th>
                    <th className="px-6 py-4 font-medium text-right">總市值</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.map((stock) => (
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
        )}
      </main>
    </div>
  );
}
