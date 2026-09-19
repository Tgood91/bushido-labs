import React, { useState } from 'react';

export default function BushidoTradingDashboard() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAgentCall = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/agent/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, strategy: 'Druckenmiller-Seykota Hybrid' })
      });
      const data = await res.json();
      setResponse(data.decision || JSON.stringify(data));
    } catch (err: any) {
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h2 className="text-lg font-semibold mb-4 text-red-400">Bushido Trading Strategy Console</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Agent Strategy Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter market context or execution prompt..."
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm text-slate-200 focus:outline-none focus:border-red-500"
              rows={3}
            />
          </div>
          <button
            onClick={handleAgentCall}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium text-white transition disabled:opacity-50"
          >
            {loading ? 'Evaluating Market...' : 'Run Strategy Analysis'}
          </button>
        </div>
      </div>

      {response && (
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Agent Execution Decision</h3>
          <pre className="bg-slate-950 p-4 rounded text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}
