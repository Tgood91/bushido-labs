import { useState } from 'react';
import BushidoTradingDashboard from '../bushido_trading_dashboard';
import './styles.css';

export default function App() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#dashboard" aria-label="Bushido Trading Protocol home">
          <span className="brand-mark">武</span>
          <span><strong>BUSHIDO</strong><small>TRADING PROTOCOL</small></span>
        </a>
        <div className="ticker" aria-label="Market prices">
          <span><b>ETH</b> $3,451.32 <i>+3.2%</i></span>
          <span><b>AERO</b> $1.23 <i>+5.2%</i></span>
          <span><b>VIRTUAL</b> $2.18 <em>-1.02%</em></span>
        </div>
        <div className="top-actions">
          <button className={connected ? 'wallet connected' : 'wallet'} onClick={() => setConnected(!connected)}>
            <span className="wallet-dot" />{connected ? '0x7A3F…9c28' : 'Connect wallet'}
          </button>
          <button className="network">Base <span>⌄</span></button>
        </div>
      </header>
      <BushidoTradingDashboard connected={connected} onConnect={() => setConnected(true)} />
    </div>
  );
}
