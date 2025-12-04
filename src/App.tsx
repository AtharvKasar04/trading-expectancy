import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
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
    <div className="min-h-screen w-full bg-[#111] text-gray-100 font-sans flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Column */}
          <div className="lg:col-span-5 space-y-6">
            <InputPanel inputs={inputs} onChange={setInputs} />
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7">
            <ResultsPanel results={results} inputs={inputs} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
