import React, { useState } from 'react';
import BushidoTradingDashboard from './components/bushido_trading_dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 p-4 bg-slate-900 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold tracking-wider text-red-500">BUSHIDO VIRTUALS TRADES</h1>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">v2.5</span>
        </div>
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded text-sm ${activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Dashboard
          </button>
        </nav>
      </header>

      <main className="flex-1 p-6">
        {activeTab === 'dashboard' && <BushidoTradingDashboard />}
      </main>
    </div>
  );
}
