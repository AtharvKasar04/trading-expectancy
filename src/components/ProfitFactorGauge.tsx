import React, { useMemo } from 'react';
import type { CalculatorInputs } from '../types';

interface Props {
    inputs: CalculatorInputs;
}

// ─── SVG gauge math ───────────────────────────────────────────────────────────
//
// The gauge is the TOP semi-circle of a circle centred at (CX, CY).
//
// Parametrisation:  t ∈ [0, 1]
//   t = 0  →  LEFT  endpoint  (9 o'clock, angleDeg = 180°)
//   t = 0.5 → TOP   endpoint  (12 o'clock, angleDeg = 270°)
//   t = 1  →  RIGHT endpoint  (3 o'clock, angleDeg = 360°)
//
// In SVG +Y points DOWN, so:
//   x = cx + r·cos(θ)
//   y = cy + r·sin(θ)
//
//   θ = 180°: cos=-1, sin= 0  →  (cx-r,  cy)      ← left  ✓
//   θ = 270°: cos= 0, sin=-1  →  (cx,    cy-r)     ← top   ✓  (Y is ABOVE)
//   θ = 360°: cos=+1, sin= 0  →  (cx+r,  cy)       ← right ✓
//
// Arc direction: going clockwise on screen (left → top → right).
// In SVG, clockwise = sweep-flag = 1.
//
const CX = 120;   // horizontal centre of gauge
const CY = 115;   // vertical   centre (baseline of arc)
const R = 85;    // radius
const SW = 14;    // stroke width
const MAX_PF = 3; // PF mapped to full scale

function gaugePoint(t: number): { x: number; y: number } {
    const deg = 180 + t * 180;              // 180° … 360°
    const rad = (deg * Math.PI) / 180;
    return {
        x: CX + R * Math.cos(rad),
        y: CY + R * Math.sin(rad),            // sin is NEGATIVE for 180-360 → point goes UP ✓
    };
}

// Builds an SVG arc string from fraction t0 → t1, clockwise (sweep=1).
function buildArc(t0: number, t1: number): string {
    const s = gaugePoint(t0);
    const e = gaugePoint(t1);
    const deg = (t1 - t0) * 180;           // angular span (°)
    const lg = deg > 180 ? 1 : 0;         // large-arc-flag
    return [
        `M ${s.x.toFixed(3)} ${s.y.toFixed(3)}`,
        `A ${R} ${R} 0 ${lg} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`,
    ].join(' ');
}

// ─── Component ────────────────────────────────────────────────────────────────
export const ProfitFactorGauge: React.FC<Props> = ({ inputs }) => {
    const profitFactor = useMemo(() => {
        const W = inputs.winRate / 100;
        const RR = inputs.rewardToRisk;
        const risk = inputs.riskPerTrade;
        const gp = W * (RR * risk);
        const gl = (1 - W) * risk;
        if (gl === 0) return W > 0 ? 99 : 0;
        return gp / gl;
    }, [inputs]);

    // Clamp PF to [0, MAX_PF] then get fill fraction
    const pfClamped = Math.min(Math.max(profitFactor, 0), MAX_PF);
    const fillFrac = pfClamped / MAX_PF;           // 0 → 1

    // Color zone
    let color: string;
    let zone: string;
    if (profitFactor < 1.0) {
        color = '#ef4444'; zone = 'DANGER ZONE';
    } else if (profitFactor < 1.5) {
        color = '#f59e0b'; zone = 'ACCEPTABLE';
    } else {
        color = '#4ade80'; zone = 'PROFITABLE';
    }

    // Full track (t: 0 → 1)
    const trackPath = buildArc(0, 1);

    // Needle tip
    const needle = gaugePoint(fillFrac);

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
            {/* ── Title ── */}
            <h3
                style={{
                    color: '#ECDFCC',
                    fontSize: '18px',
                    fontWeight: 600,
                    marginBottom: '16px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #4a4e46',
                    margin: '0 0 16px',
                }}
            >
                Strategy Efficiency
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/*
          viewBox: 240 wide, 145 tall.
          Arc top = CY - R = 115 - 85 = 30  (30 px from SVG top).
          Arc base = CY      = 115            (30 px from SVG bottom).
          Stroke half = 7 px padding already included in 30 px gap.
        */}
                <svg
                    viewBox="0 0 240 145"
                    style={{ width: '100%', maxWidth: '300px', display: 'block', overflow: 'visible' }}
                >
                    {/* ── Grey track ── */}
                    <path
                        d={trackPath}
                        fill="none"
                        stroke="#252820"
                        strokeWidth={SW}
                        strokeLinecap="round"
                    />

                    {/* ── Danger band (t: 0 → 1/3) ── */}
                    {fillFrac > 0.002 && (
                        <path
                            d={buildArc(0, Math.min(fillFrac, 1 / 3))}
                            fill="none"
                            stroke={profitFactor < 1 ? '#ef4444' : '#ef444440'}
                            strokeWidth={SW}
                            strokeLinecap="round"
                        />
                    )}

                    {/* ── Acceptable band (t: 1/3 → 2/3) — only if PF ≥ 1 ── */}
                    {fillFrac > 1 / 3 && (
                        <path
                            d={buildArc(1 / 3, Math.min(fillFrac, 2 / 3))}
                            fill="none"
                            stroke={profitFactor < 1.5 ? '#f59e0b' : '#f59e0b40'}
                            strokeWidth={SW}
                            strokeLinecap="round"
                        />
                    )}

                    {/* ── Good band (t: 2/3 → 1) — only if PF ≥ 1.5 ── */}
                    {fillFrac > 2 / 3 && (
                        <path
                            d={buildArc(2 / 3, fillFrac)}
                            fill="none"
                            stroke="#4ade80"
                            strokeWidth={SW}
                            strokeLinecap="round"
                        />
                    )}

                    {/* ── Zone divider ticks ── */}
                    {[1 / 3, 2 / 3].map((t) => {
                        // Move tick point slightly inward/outward
                        const deg = 180 + t * 180;
                        const rad = (deg * Math.PI) / 180;
                        const ix = CX + (R - SW / 2 - 2) * Math.cos(rad);
                        const iy = CY + (R - SW / 2 - 2) * Math.sin(rad);
                        const ox = CX + (R + SW / 2 + 2) * Math.cos(rad);
                        const oy = CY + (R + SW / 2 + 2) * Math.sin(rad);
                        return (
                            <line
                                key={t}
                                x1={ix} y1={iy}
                                x2={ox} y2={oy}
                                stroke="#3C3D37"
                                strokeWidth={2.5}
                            />
                        );
                    })}

                    {/* ── Needle glow dot ── */}
                    <circle
                        cx={needle.x}
                        cy={needle.y}
                        r={7}
                        fill="#181C14"
                        stroke={color}
                        strokeWidth={3}
                        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                    />

                    {/* ── PF value (large, centred) ── */}
                    <text
                        x={CX}
                        y={CY - 24}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="36"
                        fontWeight="800"
                        fill={color}
                        fontFamily="ui-monospace, SFMono-Regular, monospace"
                        style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}
                    >
                        {profitFactor >= 99 ? '∞' : profitFactor.toFixed(2)}
                    </text>

                    {/* ── "PROFIT FACTOR" label ── */}
                    <text
                        x={CX}
                        y={CY + 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="8.5"
                        fill="#697565"
                        letterSpacing="2"
                        fontWeight="600"
                    >
                        PROFIT FACTOR
                    </text>

                    {/* ── Zone label ── */}
                    <text
                        x={CX}
                        y={CY + 18}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="10"
                        fill={color}
                        fontWeight="700"
                        letterSpacing="1"
                    >
                        {zone}
                    </text>

                    {/* ── Scale labels at arc endpoints ── */}
                    <text x={22} y={CY + 4} textAnchor="middle" fontSize="9" fill="#697565">0</text>
                    <text x={218} y={CY + 4} textAnchor="middle" fontSize="9" fill="#697565">3+</text>
                </svg>

                {/* ── Legend ── */}
                <div
                    style={{
                        display: 'flex',
                        gap: '16px',
                        marginTop: '8px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    {([
                        { c: '#ef4444', label: '< 1.0 · Danger' },
                        { c: '#f59e0b', label: '1.0–1.5 · OK' },
                        { c: '#4ade80', label: '> 1.5 · Profitable' },
                    ] as const).map(({ c, label }) => (
                        <span
                            key={label}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: 8, height: 8,
                                    borderRadius: '50%',
                                    background: c,
                                    boxShadow: `0 0 5px ${c}88`,
                                    flexShrink: 0,
                                }}
                            />
                            <span style={{ color: '#697565', fontSize: '11px', whiteSpace: 'nowrap' }}>
                                {label}
                            </span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
