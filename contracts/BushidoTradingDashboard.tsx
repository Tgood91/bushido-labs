import React, { useState, KeyboardEvent } from 'react';
import { Play, Loader2, Terminal, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

const QUICK_PROMPTS = [
  "Analyze BTC/USD momentum on 4H chart",
  "Evaluate market risk during FOMC release",
  "Scan top DEX pools for unusual volume spikes"
];

export default function BushidoTradingDashboard() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAgentCall = async (promptToRun?: string) => {
    const activePrompt = promptToRun || prompt;
    if (!activePrompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/agent/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: activePrompt, 
          strategy: 'Druckenmiller-Seykota Hybrid' 
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.decision || JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAgentCall();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 font-sans">
      {/* Strategy Control Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-base font-semibold text-slate-100 tracking-wide">
              Bushido Strategy Console
            </h2>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 w-fit">
            Druckenmiller-Seykota Hybrid
          </span>
        </div>

        {/* Input Form Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <label htmlFor="strategy-prompt" className="font-medium text-slate-300">
                Execution Context Prompt
              </label>
              <span className="hidden sm:inline text-slate-500">Press Cmd/Ctrl + Enter to run</span>
            </div>

            <textarea
              id="strategy-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter market context, risk parameters, or execution conditions..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition shadow-inner resize-y min-h-[100px]"
              rows={3}
            />
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-red-400" /> Suggested Prompts
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((qPrompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(qPrompt);
                    handleAgentCall(qPrompt);
                  }}
                  disabled={loading}
                  className="text-xs bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-300 px-3 py-1.5 rounded-lg transition text-left disabled:opacity-50"
                >
                  {qPrompt}
                </button>
              ))}
            </div>
          </div>

          {/* Controls Footer */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleAgentCall()}
              disabled={loading || !prompt.trim()}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium px-5 py-2.5 rounded-lg text-sm shadow-md shadow-red-950/50 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Evaluating Market...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Strategy Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Output */}
      {error && (
        <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-4 flex items-start space-x-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Execution Failed</p>
            <p className="text-red-300/80 text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Strategy Output Section */}
      {response && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all animate-in fade-in duration-200">
          <div className="px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/50 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-slate-300 text-sm font-medium">
              <Terminal className="w-4 h-4 text-green-400" />
              <span>Agent Execution Output</span>
            </div>
            <button
              onClick={() => handleAgentCall()}
              disabled={loading}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition"
              title="Re-run Strategy"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="p-6 bg-slate-950/90">
            <pre className="text-xs sm:text-sm font-mono text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-emerald-950">
              {response}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
