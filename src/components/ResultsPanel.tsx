import React from 'react';
import type { CalculationResults as ResultsType, CalculatorInputs as InputsType } from '../types';
import { formatCurrency as fmtCurrency, formatNumber as fmtNumber } from '../utils/calculations';

interface ResultsPanelProps {
    results: ResultsType;
    inputs: InputsType;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, inputs }) => {
    const isPos = results.expectancyR >= 0;
    const edgeColor = isPos ? 'var(--green)' : 'var(--red)';
    const edgeShadow = isPos ? '0 0 24px rgba(74,222,128,0.25)' : '0 0 24px rgba(239,68,68,0.25)';
    const edgeBg = isPos ? 'rgba(74,222,128,0.06)' : 'rgba(239,68,68,0.06)';
    const edgeBorder = isPos ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ── Expectancy hero card ── */}
            <div
                className="anim-fade-up anim-delay-1"
                style={{
                    background: edgeBg,
                    border: `1px solid ${edgeBorder}`,
                    borderRadius: '14px',
                    padding: '22px 24px',
                    boxShadow: edgeShadow,
                    transition: 'box-shadow 0.4s',
                }}
            >
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Expectancy per Trade
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                    <span
                        style={{
                            fontSize: '40px', fontWeight: 800,
                            fontFamily: "'JetBrains Mono', monospace",
                            color: edgeColor,
                            textShadow: edgeShadow,
                            lineHeight: 1,
                        }}
                    >
                        {isPos ? '+' : ''}{fmtNumber(results.expectancyR)} R
                    </span>
                    <span style={{ fontSize: '18px', color: edgeColor, opacity: 0.75 }}>
                        ({isPos ? '+' : ''}{fmtNumber(results.expectancyPercent)}%)
                    </span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--muted)' }}>
                    {isPos
                        ? 'Positive edge — keep refining your system'
                        : 'Negative edge — review your R:R or win rate'}
                </div>
            </div>

            {/* ── Stat chips grid ── */}
            <div
                className="anim-fade-up anim-delay-2"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}
            >
                {[
                    { label: 'Win Rate', value: `${inputs.winRate}%`, color: 'var(--green)' },
                    { label: 'Loss Rate', value: `${results.lossRate}%`, color: 'var(--red)' },
                    { label: 'Risk / Trade', value: `${inputs.riskPerTrade}%`, color: 'var(--amber)' },
                    { label: 'R : Reward', value: `1 : ${inputs.rewardToRisk}`, color: 'var(--blue)' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="stat-chip">
                        <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                            {label}
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace" }}>
                            {value}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Linear Expectation card ── */}
            <div className="card anim-fade-up anim-delay-3">
                {/* Card header */}
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
                    <h3 style={{ color: 'var(--text)', fontSize: '15px', fontWeight: 700, margin: 0 }}>
                        Linear Expectation
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>No compounding · simple projection</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <ReturnRow
                        label="Monthly Return"
                        currency={results.monthlyReturnLinearCurrency}
                        percent={results.monthlyReturnLinearPercent}
                        fmtCurrency={fmtCurrency}
                        fmtNumber={fmtNumber}
                    />
                    <div style={{ height: '1px', background: 'var(--border)' }} />
                    <ReturnRow
                        label="Yearly Return"
                        currency={results.yearlyReturnLinearCurrency}
                        percent={results.yearlyReturnLinearPercent}
                        fmtCurrency={fmtCurrency}
                        fmtNumber={fmtNumber}
                    />
                </div>

                <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '14px', marginBottom: 0 }}>
                    Simple sum of expected return per trade — no reinvestment.
                </p>
            </div>

            {/* ── Frequency footer ── */}
            <div
                className="anim-fade-up anim-delay-4"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    fontSize: '12px',
                    color: 'var(--muted)',
                }}
            >
                <span><strong style={{ color: 'var(--text)' }}>{results.totalTradesPerMonth}</strong> trades / month</span>
                <span><strong style={{ color: 'var(--text)' }}>{results.totalTradesPerYear}</strong> trades / year</span>
            </div>
        </div>
    );
};

// Sub-component for a single return row
const ReturnRow: React.FC<{
    label: string;
    currency: number;
    percent: number;
    fmtCurrency: (n: number) => string;
    fmtNumber: (n: number) => string;
}> = ({ label, currency, percent, fmtCurrency, fmtNumber }) => {
    const isPos = currency >= 0;
    const color = isPos ? 'var(--green)' : 'var(--red)';
    return (
        <div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                {label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '26px', fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace" }}>
                    {fmtCurrency(currency)}
                </span>
                <span style={{ fontSize: '14px', color, opacity: 0.8 }}>
                    ({isPos ? '+' : ''}{fmtNumber(percent)}%)
                </span>
            </div>
        </div>
    );
};
