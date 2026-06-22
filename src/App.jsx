import { useState, Suspense, lazy } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StockList } from './components/StockList';
import { DataSource } from './components/DataSource';
import { PerformanceStats } from './components/PerformanceStats';
import { ExchangeRates } from './components/ExchangeRates';

// Heavy components using Recharts — loaded only when the tab is first visited
// .then() wrapper needed because these use named exports, not default exports
const HistoryChart = lazy(() => import('./components/HistoryChart').then(m => ({ default: m.HistoryChart })));
const MacroInsights = lazy(() => import('./components/MacroInsights').then(m => ({ default: m.MacroInsights })));

const TabFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--color-on-surface-variant)' }}>
    <div className="skeleton" style={{ width: 200, height: 20 }} />
  </div>
);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} totalValue={totalValue} marketData={marketData} historyData={historyData} loading={loading} />;
      case 'stocks':
        return <StockList data={data} loading={loading} />;
      case 'history':
        return <Suspense fallback={<TabFallback />}><HistoryChart historyData={historyData} /></Suspense>;
      case 'performance':
        return <PerformanceStats stats={performanceStats} />;
      case 'rates':
        return <ExchangeRates rates={exchangeRates} loading={loading} />;
      case 'macro':
        return <Suspense fallback={<TabFallback />}><MacroInsights /></Suspense>;
      case 'datasource':
        return <DataSource sheetUrl={sheetUrl} setSheetUrl={setSheetUrl} loading={loading} error={error} refresh={refresh} />;
      default:
        return <Dashboard data={data} totalValue={totalValue} marketData={marketData} historyData={historyData} loading={loading} />;
    }
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-canvas)', color: 'var(--color-ink)', fontFamily: 'var(--font-family)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto p-4 md:p-8 pt-6 md:pt-8">
        <Header loading={loading} error={error} />
        {renderContent()}
      </main>
    </div>
  );
}
