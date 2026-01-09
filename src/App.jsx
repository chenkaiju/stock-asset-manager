import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StockList } from './components/StockList';
import { HistoryChart } from './components/HistoryChart';
import { DataSource } from './components/DataSource';
import { PerformanceStats } from './components/PerformanceStats';
import { ExchangeRates } from './components/ExchangeRates';
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

        {activeTab === 'dashboard' && (
          <Dashboard data={data} totalValue={totalValue} marketData={marketData} historyData={historyData} />
        )}

        {activeTab === 'history' && (
          <HistoryChart historyData={historyData} />
        )}

        {activeTab === 'list' && (
          <StockList data={data} />
        )}

        {activeTab === 'datasource' && (
          <DataSource
            sheetUrl={sheetUrl}
            setSheetUrl={setSheetUrl}
            error={error}
            loading={loading}
            refresh={refresh}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceStats stats={performanceStats} />
        )}

        {activeTab === 'exchangerates' && (
          <ExchangeRates rates={exchangeRates} loading={loading} />
        )}
      </main>
    </div>
  );
}
