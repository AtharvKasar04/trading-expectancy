import { useMemo, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import type { CalculatorInputs } from '../types';
import { runMonteCarloSimulation } from '../utils/monteCarlo';

interface MonteCarloChartProps {
    inputs: CalculatorInputs;
}

const COLORS = {
    bg: '#181C14',
    surface: '#3C3D37',
    grid: '#697565',
    primary: '#ECDFCC',
    green: '#22c55e',
    red: '#ef4444',
};

const NUM_PATHS = 50;
const NUM_TRADES = 240;

function formatBalance(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toFixed(0);
}

export const MonteCarloChart: React.FC<MonteCarloChartProps> = ({ inputs }) => {
    const [seed, setSeed] = useState(0);

    const simulation = useMemo(() => {
        void seed;
        return runMonteCarloSimulation(
            inputs.accountSize,
            inputs.winRate,
            inputs.riskPerTrade,
            inputs.rewardToRisk,
            NUM_PATHS,
            NUM_TRADES
        );
    }, [inputs.accountSize, inputs.winRate, inputs.riskPerTrade, inputs.rewardToRisk, seed]);

    const chartData = useMemo(() => {
        const data: Record<string, number>[] = [];
        for (let t = 0; t <= NUM_TRADES; t++) {
            const point: Record<string, number> = { trade: t, median: simulation.medianPath[t] };
            for (let p = 0; p < simulation.paths.length; p++) {
                point[`p${p}`] = simulation.paths[p].balances[t];
            }
            data.push(point);
        }
        return data;
    }, [simulation]);

    const finalMedian = simulation.medianPath[NUM_TRADES];
    const pnl = finalMedian - inputs.accountSize;
    const pnlPercent = ((finalMedian / inputs.accountSize) - 1) * 100;
    const isProfit = pnl >= 0;

    return (
        <div
            style={{ backgroundColor: COLORS.bg, borderColor: COLORS.surface }}
            className="rounded-xl border p-6 shadow-lg"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <div>
                    <h3 style={{ color: COLORS.primary }} className="text-lg font-semibold">
                        Monte Carlo Simulation
                    </h3>
                    <p style={{ color: COLORS.grid }} className="text-xs mt-0.5">
                        {NUM_PATHS} paths · {NUM_TRADES} trades (1 year)
                    </p>
                </div>
                <button
                    onClick={() => setSeed((s) => s + 1)}
                    style={{ borderColor: COLORS.surface, color: COLORS.primary }}
                    className="text-sm px-4 py-1.5 rounded-lg border hover:brightness-125 transition-all cursor-pointer"
                >
                    ↻ Re-roll
                </button>
            </div>

            <div className="w-full" style={{ height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                        <CartesianGrid stroke={COLORS.grid} strokeDasharray="4 4" strokeOpacity={0.3} />
                        <XAxis
                            dataKey="trade"
                            stroke={COLORS.grid}
                            tick={{ fill: COLORS.primary, fontSize: 11 }}
                            ticks={[0, 30, 60, 90, 120, 150, 180, 210, 240]}
                            label={{
                                value: 'Number of Trades',
                                position: 'insideBottom',
                                offset: -10,
                                fill: COLORS.primary,
                                fontSize: 12,
                            }}
                            tickLine={false}
                        />
                        <YAxis
                            stroke={COLORS.grid}
                            tick={{ fill: COLORS.primary, fontSize: 11 }}
                            tickFormatter={formatBalance}
                            label={{
                                value: 'Account Balance',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 0,
                                fill: COLORS.primary,
                                fontSize: 12,
                                style: { textAnchor: 'middle' },
                            }}
                            tickLine={false}
                            width={60}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const trade = payload[0]?.payload?.trade;
                                const median = payload[0]?.payload?.median;
                                return (
                                    <div style={{
                                        backgroundColor: COLORS.surface,
                                        border: `1px solid ${COLORS.grid}`,
                                        borderRadius: 8,
                                        padding: '8px 12px',
                                        color: COLORS.primary,
                                        fontSize: 12,
                                    }}>
                                        <div style={{ marginBottom: 4, fontWeight: 600 }}>Trade #{trade}</div>
                                        <div>Median: ${formatBalance(median ?? 0)}</div>
                                    </div>
                                );
                            }}
                        />

                        {simulation.paths.map((_, i) => (
                            <Line
                                key={`p${i}`}
                                type="monotone"
                                dataKey={`p${i}`}
                                stroke={COLORS.primary}
                                strokeWidth={1}
                                strokeOpacity={0.15}
                                dot={false}
                                activeDot={false}
                                isAnimationActive={false}
                            />
                        ))}

                        <Line
                            type="monotone"
                            dataKey="median"
                            stroke={COLORS.primary}
                            strokeWidth={2.5}
                            strokeOpacity={1}
                            dot={false}
                            activeDot={{ r: 4, fill: COLORS.primary }}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-3">
                    <span style={{ color: COLORS.grid }}>Median Final Balance:</span>
                    <span style={{ color: COLORS.primary }} className="font-semibold">
                        ${finalMedian.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span style={{ color: COLORS.grid }}>P&L:</span>
                    <span
                        style={{ color: isProfit ? COLORS.green : COLORS.red }}
                        className="font-semibold"
                    >
                        {isProfit ? '+' : ''}{pnl.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        {' '}({isProfit ? '+' : ''}{pnlPercent.toFixed(1)}%)
                    </span>
                </div>
            </div>
        </div>
    );
};
