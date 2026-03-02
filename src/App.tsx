import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { MonteCarloChart } from './components/MonteCarloChart';
import { ProfitFactorGauge } from './components/ProfitFactorGauge';
import { LosingStreakTable } from './components/LosingStreakTable';
import type { CalculatorInputs } from './types';
import { calculateResults } from './utils/calculations';

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    accountSize: 5000,
    winRate: 50,
    riskPerTrade: 1,
    rewardToRisk: 2,
    frequencyType: 'month',
    tradesPerMonth: 20,
    tradesPerDay: 1,
  });

  const results = useMemo(() => calculateResults(inputs), [inputs]);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        padding: '32px 24px 48px',
      }}
    >
      {/* Inner container — max-width to prevent ultra-wide stretch */}
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>

        {/* Header */}
        <Header />

        {/* ── Main two-column grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 420px) 1fr',
            gap: '20px',
            alignItems: 'start',
          }}
        >
          {/* Left: Inputs */}
          <InputPanel inputs={inputs} onChange={setInputs} />

          {/* Right: Results */}
          <ResultsPanel results={results} inputs={inputs} />
        </div>

        {/* ── Monte Carlo full width ── */}
        <div style={{ marginTop: '20px' }} className="anim-fade-up anim-delay-3">
          <MonteCarloChart inputs={inputs} />
        </div>

        {/* ── Analytics row ── */}
        <div
          style={{
            marginTop: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
          className="anim-fade-up anim-delay-4"
        >
          <ProfitFactorGauge inputs={inputs} />
          <LosingStreakTable inputs={inputs} />
        </div>

        {/* Footer */}
        <div style={{ marginTop: '36px', textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0 }}>
            Built by <span style={{ color: 'var(--text)', fontWeight: 600 }}>Atharv Kasar</span>
            {' · '}
            <span style={{ opacity: 0.5 }}>Not financial advice</span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;
