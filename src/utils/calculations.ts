import type { CalculatorInputs, CalculationResults } from '../types';

export const calculateResults = (inputs: CalculatorInputs): CalculationResults => {
    const {
        accountSize,
        winRate,
        riskPerTrade,
        rewardToRisk,
        frequencyType,
        tradesPerMonth: inputTradesPerMonth,
        tradesPerDay: inputTradesPerDay,
    } = inputs;

    const lossRate = 100 - winRate;
    const w = winRate / 100;
    const l = lossRate / 100;
    const r = riskPerTrade / 100;
    const RR = rewardToRisk;

    // Expectancy
    const expectancyR = (w * RR) - (l * 1);
    const expectancyPercent = expectancyR * r * 100;

    // Frequency
    const totalTradesPerMonth = frequencyType === 'month'
        ? inputTradesPerMonth
        : inputTradesPerDay * 20;
    const totalTradesPerYear = totalTradesPerMonth * 12;

    // Linear Returns
    const monthlyReturnLinearPercent = expectancyPercent * totalTradesPerMonth;
    const monthlyReturnLinearCurrency = accountSize * (monthlyReturnLinearPercent / 100);

    const yearlyReturnLinearPercent = monthlyReturnLinearPercent * 12;
    const yearlyReturnLinearCurrency = accountSize * (yearlyReturnLinearPercent / 100);

    // Compounded Returns
    const base = 1 + (expectancyPercent / 100);
    let monthlyReturnCompoundedPercent: number | null = null;
    let monthlyEquityCompounded: number | null = null;
    let yearlyReturnCompoundedPercent: number | null = null;
    let yearlyEquityCompounded: number | null = null;

    if (base > 0) {
        monthlyEquityCompounded = accountSize * Math.pow(base, totalTradesPerMonth);
        monthlyReturnCompoundedPercent = ((monthlyEquityCompounded / accountSize) - 1) * 100;

        yearlyEquityCompounded = accountSize * Math.pow(base, totalTradesPerYear);
        yearlyReturnCompoundedPercent = ((yearlyEquityCompounded / accountSize) - 1) * 100;
    }

    return {
        lossRate,
        expectancyR,
        expectancyPercent,
        monthlyReturnLinearPercent,
        monthlyReturnLinearCurrency,
        yearlyReturnLinearPercent,
        yearlyReturnLinearCurrency,
        base,
        monthlyReturnCompoundedPercent,
        monthlyEquityCompounded,
        yearlyReturnCompoundedPercent,
        yearlyEquityCompounded,
        totalTradesPerMonth,
        totalTradesPerYear,
    };
};

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value).replace('$', ''); // Remove symbol as requested "Currency-agnostic" but usually users like separators. 
    // Wait, req says "Currency-agnostic (just a number, no fixed symbol)".
    // But for output "expectedMonthlyReturnCurrency_linear in currency terms, formatted with thousand separators."
    // So I will just use decimal format with separators.
};

export const formatNumber = (value: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
};
