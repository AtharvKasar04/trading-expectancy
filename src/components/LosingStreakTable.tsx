import React, { useMemo } from 'react';
import type { CalculatorInputs } from '../types';

interface Props {
    inputs: CalculatorInputs;
}

const STREAK_LENGTHS = [3, 5, 8, 10, 12];
const SAMPLE_SIZE = 100;

function calcStreakProb(lossRate: number, streakLen: number, sampleSize: number): number {
    // P(streak n in sampleSize trades) ≈ 1 - (1 - lossRate^n)^sampleSize
    const pSingle = Math.pow(lossRate, streakLen);
    const prob = 1 - Math.pow(1 - pSingle, sampleSize);
    return Math.min(prob * 100, 100);
}

function getRiskLevel(pct: number): { label: string; color: string } {
    if (pct >= 75) return { label: 'High', color: '#ef4444' };
    if (pct >= 40) return { label: 'Moderate', color: '#f59e0b' };
    return { label: 'Low', color: '#4ade80' };
}

export const LosingStreakTable: React.FC<Props> = ({ inputs }) => {
    const lossRate = (100 - inputs.winRate) / 100;

    const rows = useMemo(
        () =>
            STREAK_LENGTHS.map((n) => ({
                streak: n,
                prob: calcStreakProb(lossRate, n, SAMPLE_SIZE),
            })),
        [lossRate]
    );

    const fiveStreak = rows.find((r) => r.streak === 5);
    const fiveProb = fiveStreak ? fiveStreak.prob.toFixed(1) : '—';

    return (
        <div
            style={{
                backgroundColor: '#3C3D37',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #4a4e46',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
        >
            <h3
                style={{
                    color: '#ECDFCC',
                    fontSize: '18px',
                    fontWeight: 600,
                    marginBottom: '16px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #4a4e46',
                }}
            >
                Losing Streak Stress Test
            </h3>

            <p style={{ color: '#697565', fontSize: '12px', marginBottom: '16px', lineHeight: 1.5 }}>
                Probability of <em>n</em> consecutive losses occurring within a{' '}
                <strong style={{ color: '#ECDFCC' }}>100-trade</strong> sequence.
            </p>

            {/* Table */}
            <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2a2e26' }}>
                            {['Streak Length', 'Probability (%)', 'Risk Level'].map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        padding: '10px 14px',
                                        textAlign: h === 'Streak Length' ? 'left' : 'center',
                                        color: '#697565',
                                        fontWeight: 600,
                                        letterSpacing: '0.04em',
                                        fontSize: '11px',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => {
                            const { label, color } = getRiskLevel(row.prob);
                            return (
                                <StreakRow
                                    key={row.streak}
                                    streak={row.streak}
                                    prob={row.prob}
                                    riskLabel={label}
                                    riskColor={color}
                                    isEven={i % 2 === 0}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Risk Warning */}
            <div
                style={{
                    marginTop: '16px',
                    padding: '10px 14px',
                    backgroundColor: '#1e2119',
                    borderRadius: '8px',
                    borderLeft: '3px solid #f59e0b',
                }}
            >
                <p style={{ color: '#697565', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
                    ⚠{' '}
                    <span style={{ color: '#ECDFCC', fontWeight: 500 }}>Risk Warning:</span> Statistically, a 5-loss
                    streak is{' '}
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>{fiveProb}%</span> likely in your next 100
                    trades.
                </p>
            </div>
        </div>
    );
};

// Isolated row with hover state
const StreakRow: React.FC<{
    streak: number;
    prob: number;
    riskLabel: string;
    riskColor: string;
    isEven: boolean;
}> = ({ streak, prob, riskLabel, riskColor, isEven }) => {
    const [hovered, setHovered] = React.useState(false);

    return (
        <tr
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: hovered
                    ? 'rgba(105, 117, 101, 0.12)'
                    : isEven
                        ? 'rgba(255,255,255,0.02)'
                        : 'transparent',
                transition: 'background-color 0.18s ease',
                cursor: 'default',
            }}
        >
            <td
                style={{
                    padding: '10px 14px',
                    color: '#ECDFCC',
                    fontWeight: 500,
                    borderTop: '1px solid #35392f',
                }}
            >
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <span
                        style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            backgroundColor: '#1e2119',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#ECDFCC',
                        }}
                    >
                        {streak}
                    </span>
                    <span style={{ color: '#697565' }}>consecutive losses</span>
                </span>
            </td>
            <td
                style={{
                    padding: '10px 14px',
                    textAlign: 'center',
                    color: '#ECDFCC',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    borderTop: '1px solid #35392f',
                }}
            >
                {prob.toFixed(1)}%
            </td>
            <td
                style={{
                    padding: '10px 14px',
                    textAlign: 'center',
                    borderTop: '1px solid #35392f',
                }}
            >
                <span
                    style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: riskColor,
                        backgroundColor: `${riskColor}18`,
                        border: `1px solid ${riskColor}40`,
                    }}
                >
                    {riskLabel}
                </span>
            </td>
        </tr>
    );
};
