import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StockList } from './components/StockList';
import { HistoryChart } from './components/HistoryChart';
import { DataSource } from './components/DataSource';
import { PerformanceStats } from './components/PerformanceStats';
import { ExchangeRates } from './components/ExchangeRates';
import { MacroInsights } from './components/MacroInsights';

import { useStockData } from './hooks/useStockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {
    data,
    historyData,
    performanceStats,
    marketData,
    exchangeRates,
    loading,
    error,
    sheetUrl,
    setSheetUrl,
    totalValue,
    refresh
  } = useStockData();

  // Setup periodic refresh
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [refresh]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} totalValue={totalValue} marketData={marketData} historyData={historyData} />;
      case 'stocks': // Renamed from 'list'
        return <StockList data={data} />;
      case 'history': // Existing tab
        return <HistoryChart historyData={historyData} />;
      case 'performance': // Existing tab
        return <PerformanceStats stats={performanceStats} />;

      case 'rates': // Renamed from 'exchangerates'
        return <ExchangeRates rates={exchangeRates} loading={loading} />;
      case 'macro': // New tab
        return <MacroInsights />;
      case 'datasource': // Existing tab, renamed to 'settings' in snippet but keeping original for now
        return <DataSource sheetUrl={sheetUrl} setSheetUrl={setSheetUrl} loading={loading} error={error} refresh={refresh} />;
      default:
        return <Dashboard data={data} totalValue={totalValue} marketData={marketData} historyData={historyData} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 md:pb-0 md:pl-64 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto p-4 md:p-10 pt-8 md:pt-10">
        <Header
          loading={loading}
          sheetUrl={sheetUrl}
          setSheetUrl={setSheetUrl}
          error={error}
        />

        {renderContent()}
      </main>
    </div>
  );
}
