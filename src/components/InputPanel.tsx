import React, { useState } from 'react';
import type { CalculatorInputs, TradeFrequency } from '../types';

interface InputPanelProps {
    inputs: CalculatorInputs;
    onChange: (newInputs: CalculatorInputs) => void;
}

// ─── Minimal inline SVG icons ─────────────────────────────────────────────────
const IconWarn = ({ color = 'var(--amber)' }: { color?: string }) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const IconStar = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const PRESET_SIZES = [5000, 10000, 15000, 25000, 50000, 100000, 200000];

const FieldLabel = ({ text }: { text: string }) => (
    <span style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--muted)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {text}
    </span>
);

export const InputPanel: React.FC<InputPanelProps> = ({ inputs, onChange }) => {
    const set = (field: keyof CalculatorInputs, value: number | string) =>
        onChange({ ...inputs, [field]: value });

    const setFreq = (type: TradeFrequency) =>
        onChange({ ...inputs, frequencyType: type });

    const lossRate = 100 - inputs.winRate;

    // Track whether the user has selected "Custom" in the dropdown
    const isPreset = PRESET_SIZES.includes(inputs.accountSize);
    const [useCustom, setUseCustom] = useState(!isPreset);

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'custom') {
            setUseCustom(true);
        } else {
            setUseCustom(false);
            set('accountSize', parseFloat(val));
        }
    };

    const selectValue = useCustom ? 'custom' : String(inputs.accountSize);

    const selectStyle: React.CSSProperties = {
        width: '100%',
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '9px 14px',
        color: 'var(--text)',
        fontSize: '14px',
        fontFamily: 'inherit',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23697565' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: '32px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    return (
        <div className="card anim-fade-up anim-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Title */}
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
                <h2 style={{ color: 'var(--text)', fontSize: '16px', fontWeight: 700, margin: 0 }}>
                    Strategy Inputs
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '12px', margin: '3px 0 0' }}>
                    Adjust parameters to model your edge
                </p>
            </div>

            {/* Account Size */}
            <div>
                <FieldLabel text="Account Size ($)" />
                {/* Preset dropdown */}
                <select
                    value={selectValue}
                    onChange={handleDropdownChange}
                    style={selectStyle}
                >
                    {PRESET_SIZES.map((s) => (
                        <option key={s} value={String(s)} style={{ background: '#2a2e26', color: '#ECDFCC' }}>
                            ${s.toLocaleString()}
                        </option>
                    ))}
                    <option value="custom" style={{ background: '#2a2e26', color: '#ECDFCC' }}>
                        Custom amount...
                    </option>
                </select>

                {/* Custom number input — shown only when "Custom" is chosen */}
                {useCustom && (
                    <div style={{ position: 'relative', marginTop: '8px' }}>
                        <span style={{
                            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                            color: 'var(--muted)', fontSize: '14px', pointerEvents: 'none',
                        }}>$</span>
                        <input
                            type="number"
                            className="themed-input"
                            value={inputs.accountSize}
                            placeholder="Enter custom amount"
                            onChange={(e) => set('accountSize', parseFloat(e.target.value) || 0)}
                            style={{ paddingLeft: '26px' }}
                            autoFocus
                        />
                    </div>
                )}
            </div>

            {/* Win Rate */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <FieldLabel text="Win Rate" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                        <input
                            type="number" min="0" max="100"
                            className="themed-input"
                            value={inputs.winRate}
                            onChange={(e) => {
                                let v = parseFloat(e.target.value);
                                v = Math.max(0, Math.min(100, v || 0));
                                set('winRate', v);
                            }}
                            style={{ width: '60px', padding: '5px 8px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}
                        />
                        <span style={{ color: 'var(--muted)', fontSize: '13px' }}>%</span>
                    </div>
                </div>
                <input
                    type="range" min="0" max="100"
                    value={inputs.winRate}
                    onChange={(e) => set('winRate', parseFloat(e.target.value))}
                    style={{
                        width: '100%',
                        background: `linear-gradient(to right, var(--green) ${inputs.winRate}%, var(--surface2) ${inputs.winRate}%)`,
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--muted)' }}>0%</span>
                    <span style={{ fontSize: '10px', color: 'var(--muted)' }}>50%</span>
                    <span style={{ fontSize: '10px', color: 'var(--muted)' }}>100%</span>
                </div>
                {inputs.winRate > 85 && (
                    <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--green)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <IconStar /> Elite edge detected
                    </div>
                )}
            </div>

            {/* Win / Loss chips */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Chip label="Win Rate" value={`${inputs.winRate}%`} color="var(--green)" />
                <Chip label="Loss Rate" value={`${lossRate}%`} color="var(--red)" />
            </div>

            {/* Risk per Trade */}
            <div>
                <FieldLabel text="Risk per Trade (% of account)" />
                <div style={{ position: 'relative' }}>
                    <input
                        type="number" min="0" max="100" step="0.1"
                        className="themed-input"
                        value={inputs.riskPerTrade}
                        onChange={(e) => set('riskPerTrade', parseFloat(e.target.value) || 0)}
                        style={{ paddingRight: '30px' }}
                    />
                    <span style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--muted)', fontSize: '13px', pointerEvents: 'none',
                    }}>%</span>
                </div>
                {inputs.riskPerTrade > 5 && (
                    <div style={{ marginTop: '5px', fontSize: '12px', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <IconWarn color="var(--red)" /> High risk — consider reducing position size
                    </div>
                )}
            </div>

            {/* Reward-to-Risk */}
            <div>
                <FieldLabel text="Risk : Reward" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '13px', whiteSpace: 'nowrap' }}>1 :</span>
                    <input
                        type="number" min="0" step="0.1"
                        className="themed-input"
                        value={inputs.rewardToRisk}
                        onChange={(e) => set('rewardToRisk', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 2"
                    />
                </div>
                {inputs.rewardToRisk > 10 && (
                    <div style={{ marginTop: '5px', fontSize: '12px', color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <IconWarn /> That R:R is ambitious — verify your backtests
                    </div>
                )}
            </div>

            {/* Trade Frequency */}
            <div>
                <FieldLabel text="Trade Frequency" />
                {/* Toggle */}
                <div style={{
                    display: 'flex',
                    background: 'var(--surface2)',
                    borderRadius: '8px',
                    padding: '3px',
                    marginBottom: '10px',
                    border: '1px solid var(--border)',
                }}>
                    {(['month', 'day'] as TradeFrequency[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setFreq(t)}
                            style={{
                                flex: 1,
                                padding: '6px 0',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: inputs.frequencyType === t ? 'var(--surface)' : 'transparent',
                                color: inputs.frequencyType === t ? 'var(--text)' : 'var(--muted)',
                                boxShadow: inputs.frequencyType === t ? '0 1px 6px rgba(0,0,0,0.3)' : 'none',
                            }}
                        >
                            {t === 'month' ? 'Per Month' : 'Per Day'}
                        </button>
                    ))}
                </div>
                <input
                    type="number" min="0"
                    className="themed-input"
                    value={inputs.frequencyType === 'month' ? inputs.tradesPerMonth : inputs.tradesPerDay}
                    onChange={(e) => {
                        const field = inputs.frequencyType === 'month' ? 'tradesPerMonth' : 'tradesPerDay';
                        set(field, parseFloat(e.target.value) || 0);
                    }}
                    placeholder={inputs.frequencyType === 'month' ? 'trades / month' : 'trades / day'}
                />
            </div>
        </div>
    );
};

const Chip: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className="stat-chip" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {label}
        </div>
        <div style={{ fontSize: '20px', fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace" }}>
            {value}
        </div>
    </div>
);
