import { useMemo, useState } from 'react';
import { ArrowDownUp, Bell, ChevronDown, HelpCircle, Compass, Copy, ExternalLink, LayoutDashboard, Settings, ShieldCheck, Sparkles, WalletCards, X } from 'lucide-react';

type Token = { symbol: string; name: string; balance: string; price: number; icon: string };
const tokens: Token[] = [
  { symbol: 'USDC', name: 'USD Coin', balance: '6,582.41', price: 1, icon: '◉' },
  { symbol: 'ETH', name: 'Ethereum', balance: '1.2456', price: 3451.32, icon: '◆' },
  { symbol: 'AERO', name: 'Aerodrome', balance: '2,340.12', price: 1.23, icon: '✦' },
  { symbol: 'VIRTUAL', name: 'Virtual Protocol', balance: '1,102.33', price: 2.18, icon: '◒' },
];
const virtues = [{name:'Gi', value:94, label:'Righteousness', metric:'Execution fidelity', color:'#d4af37'}, {name:'Yu', value:78, label:'Courage', metric:'Position conviction', color:'#e06b5e'}, {name:'Jin', value:85, label:'Benevolence', metric:'Liquidity depth', color:'#3d9dde'}, {name:'Rei', value:88, label:'Respect', metric:'Slippage control', color:'#a77be7'}, {name:'Makoto', value:95, label:'Sincerity', metric:'Chain clarity', color:'#45d7a7'}];
const routers = [
  { id: '1inch', name: '1inch v5 Aggregation', detail: 'Primary route · best execution', gi: 9.8, makoto: 10 },
  { id: 'lifi', name: 'LI.FI Diamond', detail: 'Cross-chain fallback', gi: 7.2, makoto: 8 },
  { id: '0x', name: '0x Protocol Router', detail: 'Base liquidity fallback', gi: 6, makoto: 9 },
];
type JournalTrade = { id: number; route: string; amount: string; router: string; status: 'Complete' | 'Pending'; time: string };

function TokenBadge({ token }: { token: Token }) { return <span className={`token-badge ${token.symbol.toLowerCase()}`}>{token.icon}</span>; }

export default function BushidoTradingDashboard({ connected, onConnect }: { connected: boolean; onConnect: () => void }) {
  const [from, setFrom] = useState<Token>(tokens[0]);
  const [to, setTo] = useState<Token>(tokens[1]);
  const [amount, setAmount] = useState('1000');
  const [slippage, setSlippage] = useState('0.50');
  const [showReview, setShowReview] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [routerId, setRouterId] = useState('1inch');
  const [executionState, setExecutionState] = useState<'idle' | 'routing' | 'complete'>('idle');
  const [journal, setJournal] = useState<JournalTrade[]>([
    { id: 1, route: 'USDC → cbBTC', amount: '1,000 USDC', router: '1inch', status: 'Complete', time: '2 min ago' },
    { id: 2, route: 'BASE → ARB', amount: '500 BASE', router: 'LI.FI', status: 'Complete', time: '15 min ago' },
    { id: 3, route: 'ETH → VIRTUAL', amount: '2.5 ETH', router: '0x', status: 'Pending', time: '1 hr ago' },
  ]);
  const selectedRouter = routers.find(router => router.id === routerId) ?? routers[0];
  const numericAmount = Number(amount) || 0;
  const output = useMemo(() => from.symbol === to.symbol ? numericAmount : (numericAmount * from.price) / to.price, [from, to, numericAmount]);
  const estimatedUsd = numericAmount * from.price;
  const flip = () => { setFrom(to); setTo(from); };
  const review = () => { if (!connected) return onConnect(); setExecutionState('idle'); setShowReview(true); };
  const executeRoute = () => {
    setExecutionState('routing');
    window.setTimeout(() => {
      setExecutionState('complete');
      setJournal(current => [{ id: Date.now(), route: `${from.symbol} → ${to.symbol}`, amount: `${amount || '0'} ${from.symbol}`, router: selectedRouter.name, status: 'Complete', time: 'Just now' }, ...current]);
    }, 900);
  };

  return <main className="dashboard" id="dashboard">
    <aside className="sidebar">
      <nav>{['Dashboard','Trade','Portfolio','Strategies','BVS Score','Transactions','Analytics','Alerts'].map((item, index) => <button key={item} onClick={() => setActiveNav(item)} className={activeNav === item ? 'active' : ''}>{[LayoutDashboard, ArrowDownUp, WalletCards, Compass, ShieldCheck, Copy, Sparkles, Bell][index]({ size: 18 })}<span>{item}</span></button>)}</nav>
      <div className="sidebar-bottom"><button><Settings size={18}/>Settings</button><div className="system-status"><span /> All Systems Operational</div></div>
    </aside>

    <section className="workspace">
      <div className="mobile-title"><span>Base</span><button className="network">Base <ChevronDown size={14}/></button></div>
      <div className="content-grid">
        <div className="left-column">
          <section className="panel virtue-panel">
            <div className="panel-heading"><span>BVS · Bushido Virtue Score</span><HelpCircle size={15}/></div>
            <div className="virtue-wheel"><div className="wheel-ring"><div><strong>92.3</strong><small>OVERALL</small></div></div></div>
            <div className="virtue-list">{virtues.map(v => <div key={v.name}><span>{v.name}</span><b>{v.value}</b></div>)}</div>
            <p className="updated"><span /> Last updated: 2m ago</p>
          </section>
          <section className="panel portfolio-panel"><div className="panel-heading"><span>Portfolio Overview</span><button>View all <ExternalLink size={13}/></button></div><strong className="portfolio-value">$24,381.72</strong><p className="gain">+1,842.21 (+8.17%) <small>24h</small></p><div className="asset-list">{tokens.map((token, i) => <div className="asset" key={token.symbol}><TokenBadge token={token}/><span><b>{token.symbol}</b><small>{token.balance}</small></span><span className="asset-value">${(token.price * Number(token.balance.replace(',',''))).toLocaleString(undefined, {maximumFractionDigits: 0})}<i>{i === 3 ? '-1.02%' : `+${(i + 1) * 1.2}%`}</i></span></div>)}</div></section>
        </div>

        <section className="swap-card panel">
          <div className="swap-header"><div><span className="swap-logo">◈</span><div><h1>Spot Swap</h1><p>Swap tokens on Base with transparent routing.</p></div></div><button aria-label="Close swap"><X /></button></div>
          <TokenInput label="From" token={from} amount={amount} onAmount={setAmount} balance={from.balance} options={tokens.filter(t => t.symbol !== to.symbol)} onToken={setFrom}/>
          <button className="flip" onClick={flip} aria-label="Switch tokens"><ArrowDownUp size={19}/></button>
          <TokenInput label="To (Estimated)" token={to} amount={output.toFixed(to.symbol === 'ETH' ? 4 : 2)} readOnly options={tokens.filter(t => t.symbol !== from.symbol)} onToken={setTo}/>
          <div className="settings-block"><div className="settings-title"><span><Settings size={17}/> Router & Slippage Settings</span><ChevronDown size={17}/></div><p className="field-label">Routing</p><div className="router-options">{routers.map(router => <button type="button" key={router.id} onClick={() => setRouterId(router.id)} className={router.id === routerId ? 'route-selected selected' : 'route-selected'}><span className="route-icon">◌</span><span><b>{router.name}</b><small>{router.detail}</small></span><span className="route-score">Gi {router.gi}</span></button>)}</div><div className="slippage-row"><span>Slippage tolerance <HelpCircle size={13}/></span><div><input aria-label="Slippage tolerance" value={slippage} onChange={e => setSlippage(e.target.value)} inputMode="decimal"/><b>%</b></div></div></div>
          <div className="quote-row"><span><span className="quote-icon">◒</span> Network fee (est.)</span><b>$0.12</b></div>
          <button className="review-button" onClick={review}>{connected ? 'Review swap' : 'Connect wallet to swap'} <ArrowDownUp size={18}/></button>
          <p className="safe-note"><ShieldCheck size={14}/> Transactions require your wallet signature.</p>
        </section>

        <div className="right-column"><section className="panel activity-panel"><div className="panel-heading"><span>Trade Journal</span><button>View all</button></div>{journal.slice(0,4).map(trade => <div className="activity" key={trade.id}><span className="activity-line"/><div><b>{trade.route}</b><small>{trade.amount} · {trade.router} · {trade.time}</small></div><span className={trade.status === 'Complete' ? 'check' : 'pending'}>{trade.status === 'Complete' ? '✓' : '…'}</span></div>)}</section><section className="panel impact-panel"><div className="panel-heading"><span>Route virtue impact</span><HelpCircle size={14}/></div><b className="impact-score">Gi {selectedRouter.gi}</b><p>{selectedRouter.name} · Makoto {selectedRouter.makoto}</p><div className="impact-bars">{virtues.map((v,i) => <div key={v.name}><span style={{height:`${36 + i * 9}%`, background:v.color}}/><small>{v.name}</small></div>)}</div></section></div>
      </div>
      <section className="dojo-section">
        <div className="dojo-heading"><div><span>DOJO</span><h2>Path to mastery</h2><p>Every completed route contributes to a transparent execution record.</p></div><strong>72 <small>Honor</small></strong></div>
        <div className="virtue-cards">{virtues.map(virtue => <article key={virtue.name} className="virtue-card"><span style={{background:virtue.color}}/><b>{virtue.label}</b><strong>{(virtue.value / 10).toFixed(1)}</strong><small>/ 10 · {virtue.metric}</small></article>)}</div>
        <div className="mastery"><span>Tsurano</span><i className="mastery-fill" style={{width:'72%'}}/><span>Samurai</span><i/><span>Bushido Master</span><i/><span>Shogun</span></div>
      </section>
    </section>
    {showReview && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="review-title"><section className="review-modal"><button className="modal-close" onClick={() => setShowReview(false)}><X/></button><span className="modal-eyebrow">Review trade</span><h2 id="review-title">{amount || '0'} {from.symbol} → {output.toFixed(4)} {to.symbol}</h2><div className="review-lines"><p><span>Route</span><b>{selectedRouter.name}</b></p><p><span>Estimated value</span><b>${estimatedUsd.toLocaleString(undefined, {maximumFractionDigits:2})}</b></p><p><span>Max slippage</span><b>{slippage}%</b></p><p><span>Network fee</span><b>$0.12</b></p></div>{executionState === 'complete' ? <div className="execution-complete"><ShieldCheck size={20}/><b>Route recorded in your trade journal</b><small>Wallet signing and live execution remain to be configured.</small></div> : <button className="review-button" onClick={executeRoute} disabled={executionState === 'routing'}>{executionState === 'routing' ? 'Preparing execution…' : 'Execute route simulation'} <WalletCards size={18}/></button>}<p className="modal-disclaimer">Simulation only: this does not submit or sign a blockchain transaction.</p></section></div>}
  </main>;
}

function TokenInput({ label, token, amount, onAmount, balance, readOnly, options, onToken }: { label: string; token: Token; amount: string; onAmount?: (value: string) => void; balance?: string; readOnly?: boolean; options: Token[]; onToken: (token: Token) => void }) { return <div className="token-input"><div className="input-label"><span>{label}</span>{balance && <small>Balance: {balance}</small>}</div><div className="token-row"><div className="token-select"><TokenBadge token={token}/><select value={token.symbol} onChange={e => onToken(options.find(t => t.symbol === e.target.value) ?? token)}>{[token, ...options].map(item => <option value={item.symbol} key={item.symbol}>{item.symbol}</option>)}</select></div><div className="amount-wrap"><input value={amount} onChange={e => onAmount?.(e.target.value.replace(/[^0-9.]/g, ''))} readOnly={readOnly} inputMode="decimal"/><small>{token.name}</small></div></div></div>; }
