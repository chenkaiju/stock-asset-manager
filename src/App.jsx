import { useState, useEffect } from 'react';

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
    <div className="min-h-screen pb-24 lg:pb-0 lg:pl-64">
      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 lg:top-0 lg:bottom-0 lg:right-auto lg:w-64 lg:border-t-0 lg:border-r lg:flex lg:flex-col p-4">
        <div className="hidden lg:block mb-10 px-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            AssetFlow
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Stock Portfolio Tracker</p>
        </div>

        <div className="flex justify-around lg:flex-col lg:space-y-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-4 px-4 py-2 rounded-2xl transition-all ${activeTab === 'dashboard'
              ? 'text-white bg-white/10'
              : 'text-neutral-500 hover:text-neutral-300'
              }`}
          >
            <span>[Dash]</span>
            <span className="text-[10px] lg:text-base font-medium">概覽</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex flex-col lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-4 px-4 py-2 rounded-2xl transition-all ${activeTab === 'list'
              ? 'text-white bg-white/10'
              : 'text-neutral-500 hover:text-neutral-300'
              }`}
          >
            <span>[List]</span>
            <span className="text-[10px] lg:text-base font-medium">持股清單</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 lg:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold lg:text-4xl">我的資產</h2>
            <p className="text-neutral-400 mt-2">
              {loading ? '資料更新中...' : `最後更新於：${new Date().toLocaleTimeString()}`}
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <input
              type="text"
              placeholder="貼上 Google Apps Script URL 連結..."
              className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:border-blue-500 transition-colors"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
            />
            <button title="重新整理" onClick={() => setSheetUrl(sheetUrl)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors shrink-0">
              {loading ? <span className="animate-spin text-neutral-400">...</span> : <span className="text-emerald-400">[R]</span>}
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center">
            ⚠️ 連線錯誤: {error}。請檢查 URL 是否正確並已部署為「Anyone」可存取。
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="p-8 bg-gradient-to-br from-blue-600/20 to-cyan-600/5 rounded-[2rem] border border-white/10 backdrop-blur-sm"
              >
                <p className="text-neutral-400 font-medium">總資產估值</p>
                <h3 className="text-4xl font-bold mt-4 tracking-tight">{formatCurrency(totalValue)}</h3>
                <div className="flex items-center space-x-2 mt-4 text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1 rounded-full text-sm">
                  <span>[Up]</span>
                  <span>2.4% 今日上漲</span>
                </div>
              </div>

              <div
                className="p-8 bg-white/5 rounded-[2rem] border border-white/10"
              >
                <p className="text-neutral-400 font-medium">持股檔數</p>
                <h3 className="text-4xl font-bold mt-4 tracking-tight">{data.length} <span className="text-xl text-neutral-500">檔</span></h3>
                <div className="flex -space-x-2 mt-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-black flex items-center justify-center text-[10px]">
                      {data[i - 1]?.股票名稱[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Performance Section */}
            <section>
              <h4 className="text-xl font-bold mb-6">主要持股動態</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.slice(0, 4).map((stock, idx) => (
                  <div
                    key={stock.代號}
                    className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold">
                        {stock.股票名稱[0]}
                      </div>
                      <div>
                        <h5 className="font-bold">{stock.股票名稱}</h5>
                        <p className="text-sm text-neutral-500">{stock.代號}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(stock.現價)}</p>
                      <p className="text-sm text-neutral-500">
                        {stock.股數} 股
                      </p>
                    </div>
                    <span>[>]</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-neutral-500 text-sm">
                  <th className="px-6 py-2">名稱</th>
                  <th className="px-6 py-2">股數</th>
                  <th className="px-6 py-2">現價</th>
                  <th className="px-6 py-2">市值</th>
                </tr>
              </thead>
              <tbody>
                {data.map((stock) => (
                  <tr key={stock.代號} className="bg-white/5 border border-white/5 rounded-3xl group hover:bg-white/10 transition-colors">
                    <td className="px-6 py-5 rounded-l-3xl">
                      <div className="font-bold">{stock.股票名稱}</div>
                      <div className="text-xs text-neutral-500">{stock.代號}</div>
                    </td>
                    <td className="px-6 py-5 font-medium">{stock.股數}</td>
                    <td className="px-6 py-5">
                      <div className="font-medium text-blue-400">{stock.現價}</div>
                    </td>
                    <td className="px-6 py-5 rounded-r-3xl">
                      <div className="font-bold">{formatCurrency(stock.市值)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
