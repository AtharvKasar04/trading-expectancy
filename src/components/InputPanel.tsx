import React from 'react';
import type { CalculatorInputs, TradeFrequency } from '../types';

interface InputPanelProps {
    inputs: CalculatorInputs;
    onChange: (newInputs: CalculatorInputs) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ inputs, onChange }) => {
    const handleChange = (field: keyof CalculatorInputs, value: number | string) => {
        onChange({ ...inputs, [field]: value });
    };

    const handleFrequencyChange = (type: TradeFrequency) => {
        onChange({ ...inputs, frequencyType: type });
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">
                Inputs
            </h2>

            <div className="space-y-6">
                {/* Account Size */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Account Size
                    </label>
                    <input
                        type="number"
                        value={inputs.accountSize}
                        onChange={(e) => handleChange('accountSize', parseFloat(e.target.value) || 0)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* Win Rate */}
                <div>
                    <div className="flex justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-300">
                            Win Rate (%)
                        </label>
                        <span className="text-sm text-blue-400 font-mono">{inputs.winRate}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={inputs.winRate}
                        onChange={(e) => handleChange('winRate', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Loss Rate (Read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Loss Rate (%)
                    </label>
                    <div className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed">
                        {100 - inputs.winRate}%
                    </div>
                </div>

                {/* Risk per Trade */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Risk per Trade (% of account)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={inputs.riskPerTrade}
                        onChange={(e) => handleChange('riskPerTrade', parseFloat(e.target.value) || 0)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* Reward to Risk */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Average Reward-to-Risk (R:R)
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={inputs.rewardToRisk}
                        onChange={(e) => handleChange('rewardToRisk', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 1.5, 2, 3..."
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* Trade Frequency */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Trade Frequency
                    </label>
                    <div className="flex bg-gray-900 rounded-lg p-1 mb-3 border border-gray-700">
                        <button
                            onClick={() => handleFrequencyChange('month')}
                            className={`flex-1 py-1.5 text-sm rounded-md transition-all ${inputs.frequencyType === 'month'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Trades per Month
                        </button>
                        <button
                            onClick={() => handleFrequencyChange('day')}
                            className={`flex-1 py-1.5 text-sm rounded-md transition-all ${inputs.frequencyType === 'day'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Trades per Day
                        </button>
                    </div>

                    {inputs.frequencyType === 'month' ? (
                        <input
                            type="number"
                            min="0"
                            value={inputs.tradesPerMonth}
                            onChange={(e) => handleChange('tradesPerMonth', parseFloat(e.target.value) || 0)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    ) : (
                        <input
                            type="number"
                            min="0"
                            value={inputs.tradesPerDay}
                            onChange={(e) => handleChange('tradesPerDay', parseFloat(e.target.value) || 0)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
