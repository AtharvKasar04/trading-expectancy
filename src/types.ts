export type TradeFrequency = 'month' | 'day';

export interface CalculatorInputs {
    accountSize: number;
    winRate: number; // 0-100
    riskPerTrade: number; // % of account
    rewardToRisk: number; // R:R
    frequencyType: TradeFrequency;
    tradesPerMonth: number;
    tradesPerDay: number;
}

export interface CalculationResults {
    lossRate: number;
    expectancyR: number;
    expectancyPercent: number;

    // Linear
    monthlyReturnLinearPercent: number;
    monthlyReturnLinearCurrency: number;
    yearlyReturnLinearPercent: number;
    yearlyReturnLinearCurrency: number;

    // Compounded
    base: number; // Used to check if compounding is possible
    monthlyReturnCompoundedPercent: number | null;
    monthlyEquityCompounded: number | null;
    yearlyReturnCompoundedPercent: number | null;
    yearlyEquityCompounded: number | null;

    // Frequency Summary
    totalTradesPerMonth: number;
    totalTradesPerYear: number;
}
