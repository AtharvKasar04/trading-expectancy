import React from 'react';

const QUOTES = [
    'Cut your losses short, let your profits run.',
    'Risk management is the cornerstone of every great trader.',
    'Your win rate means nothing without a positive expectancy.',
    'A 1:2 R:R flips the odds in your favour even below 50% win rate.',
    'Trade the process, not the outcome.',
    'Consistency beats brilliance in the long run.',
    'Never risk more than you can afford to lose on a single trade.',
    'The market rewards patience and punishes impulsiveness.',
    'Edge without discipline is just gambling with extra steps.',
    'Position sizing is the difference between surviving and thriving.',
    'Journal every trade — data is your competitive edge.',
    'Emotions are the market\'s greatest weapon against retail traders.',
    'A losing streak is inevitable; a blown account is a choice.',
    'Think in probabilities, not certainties.',
    'Expectancy x frequency = growth. Both matter.',
    'The best traders are not the smartest — they are the most disciplined.',
    'Drawdowns are part of the game. Manage them, don\'t fear them.',
    'Your stop loss is your insurance policy — pay the premium.',
];

// Duplicate for seamless infinite scroll
const QUOTES_ALL = [...QUOTES, ...QUOTES];

export const Header: React.FC = () => {
    return (
        <header className="anim-fade-up mb-8">

            {/* ── Top row: title + badge ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>

                    {/* Title + icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CandleIcon />
                        <div>
                            <h1 style={{
                                color: 'var(--text)',
                                fontSize: '22px',
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                margin: 0,
                                lineHeight: 1.1,
                            }}>
                                Trading Expectancy
                                <span style={{ color: 'var(--muted)', fontWeight: 400 }}> · Calculator</span>
                            </h1>
                            <p style={{ color: 'var(--muted)', fontSize: '12px', margin: '4px 0 0' }}>
                                Quantify your edge. Simulate your strategy.
                            </p>
                        </div>
                    </div>

                    {/* Live badge */}
                    {/* <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '99px',
                        padding: '5px 14px',
                        fontSize: '11px',
                        color: 'var(--muted)',
                        whiteSpace: 'nowrap',
                    }}> */}
                        {/* <span style={{
                            width: 7, height: 7,
                            borderRadius: '50%',
                            background: 'var(--green)',
                            display: 'inline-block',
                            boxShadow: '0 0 6px var(--green)',
                            animation: 'pulse-glow 1.8s ease-in-out infinite',
                        }} /> */}
                        {/* LIVE CALCULATIONS */}
                    {/* </div> */}
                </div>
            </div>

            {/* ── Scrolling wisdom ticker ── */}
            <div
                className="ticker-wrap"
                style={{
                    background: 'var(--surface)',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    padding: '8px 0',
                }}
            >
                <div className="ticker-inner">
                    {QUOTES_ALL.map((quote, i) => (
                        <span
                            key={i}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0',
                                padding: '0 28px',
                                fontSize: '12px',
                                color: 'var(--muted)',
                                borderRight: '1px solid var(--border)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {/* Accent dash/bullet */}
                            <span style={{
                                display: 'inline-block',
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                background: i % 3 === 0 ? 'var(--green)' : i % 3 === 1 ? 'var(--amber)' : 'var(--text)',
                                marginRight: '10px',
                                flexShrink: 0,
                                opacity: 0.8,
                            }} />
                            <span style={{ color: 'var(--text)', fontStyle: 'italic' }}>{quote}</span>
                        </span>
                    ))}
                </div>
            </div>

        </header>
    );
};

// ── Animated 3-candle SVG icon ──────────────────────────────────────────────
const CandleIcon: React.FC = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
        <rect x="4" y="18" width="6" height="12" rx="1.5" fill="#ef4444" opacity="0.9"
            style={{ animation: 'candle-rise 0.6s 0.1s ease both' }} />
        <line x1="7" y1="14" x2="7" y2="18" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="7" y1="30" x2="7" y2="33" stroke="#ef4444" strokeWidth="1.5" />

        <rect x="15" y="10" width="6" height="16" rx="1.5" fill="#4ade80" opacity="0.9"
            style={{ animation: 'candle-rise 0.6s 0.25s ease both' }} />
        <line x1="18" y1="6" x2="18" y2="10" stroke="#4ade80" strokeWidth="1.5" />
        <line x1="18" y1="26" x2="18" y2="30" stroke="#4ade80" strokeWidth="1.5" />

        <rect x="26" y="8" width="6" height="18" rx="1.5" fill="#4ade80" opacity="0.9"
            style={{ animation: 'candle-rise 0.6s 0.4s ease both' }} />
        <line x1="29" y1="4" x2="29" y2="8" stroke="#4ade80" strokeWidth="1.5" />
        <line x1="29" y1="26" x2="29" y2="30" stroke="#4ade80" strokeWidth="1.5" />
    </svg>
);
