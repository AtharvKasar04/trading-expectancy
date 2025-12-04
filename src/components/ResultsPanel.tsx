import React from 'react';
import type { CalculationResults as ResultsType, CalculatorInputs as InputsType } from '../types';
import { formatCurrency as fmtCurrency, formatNumber as fmtNumber } from '../utils/calculations';

interface ResultsPanelProps {
    results: ResultsType;
    inputs: InputsType;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, inputs }) => {
    const isPositiveExpectancy = results.expectancyR >= 0;
    const expectancyColor = isPositiveExpectancy ? 'text-green-400' : 'text-red-400';
    const expectancyBg = isPositiveExpectancy ? 'bg-green-400/10' : 'bg-red-400/10';
    const expectancyBorder = isPositiveExpectancy ? 'border-green-400/20' : 'border-red-400/20';

    return (
        <div className="space-y-6">
            {/* Edge Summary Card */}
            <div className={`p-6 rounded-xl border ${expectancyBorder} ${expectancyBg} shadow-lg transition-all`}>
                <h3 className="text-gray-300 font-medium mb-2">Expectancy per Trade</h3>
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                    <span className={`text-4xl font-bold ${expectancyColor}`}>
                        {results.expectancyR >= 0 ? '+' : ''}{fmtNumber(results.expectancyR)} R
                    </span>
                    <span className={`text-xl ${expectancyColor}`}>
                        ({results.expectancyPercent >= 0 ? '+' : ''}{fmtNumber(results.expectancyPercent)}%)
                    </span>
                </div>
            </div>

            {/* Win/Loss Info */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Win Rate</div>
                    <div className="text-xl font-semibold text-white">{inputs.winRate}%</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Loss Rate</div>
                    <div className="text-xl font-semibold text-white">{results.lossRate}%</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Risk per Trade</div>
                    <div className="text-xl font-semibold text-white">{inputs.riskPerTrade}%</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Reward:Risk</div>
                    <div className="text-xl font-semibold text-white">{inputs.rewardToRisk}</div>
                </div>
            </div>

            {/* Linear Expectation */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                    Linear Expectation <span className="text-xs font-normal text-gray-400 ml-2">(No Compounding)</span>
                </h3>

                <div className="space-y-4">
                    <div>
                        <div className="text-gray-400 text-sm mb-1">Expected Monthly Return</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">
                                {fmtCurrency(results.monthlyReturnLinearCurrency)}
                            </span>
                            <span className={`text-sm ${results.monthlyReturnLinearPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ({results.monthlyReturnLinearPercent >= 0 ? '+' : ''}{fmtNumber(results.monthlyReturnLinearPercent)}%)
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="text-gray-400 text-sm mb-1">Expected Yearly Return</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">
                                {fmtCurrency(results.yearlyReturnLinearCurrency)}
                            </span>
                            <span className={`text-sm ${results.yearlyReturnLinearPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ({results.yearlyReturnLinearPercent >= 0 ? '+' : ''}{fmtNumber(results.yearlyReturnLinearPercent)}%)
                            </span>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    Assumes simple sum of expected returns per trade.
                </p>
            </div>



            {/* Trade Frequency Summary */}
            <div className="flex justify-between text-xs text-gray-500 px-2">
                <span>Trades/Month: {results.totalTradesPerMonth}</span>
                <span>Trades/Year: {results.totalTradesPerYear}</span>
            </div>
        </div>
    );
};
