import React from 'react';
import { Icons } from './Icons';

const NAV_ITEMS = [
    { tab: 'dashboard',  label: '概覽',    Icon: Icons.LayoutDashboard },
    { tab: 'history',    label: '趨勢分析', Icon: Icons.BarChart3 },
    { tab: 'stocks',     label: '持股清單', Icon: Icons.List },
    { tab: 'performance',label: '績效分析', Icon: Icons.Activity },
    { tab: 'rates',      label: '匯率資訊', Icon: Icons.Globe },
    { tab: 'macro',      label: '總經觀察', Icon: Icons.TrendingUp },
    { tab: 'datasource', label: '資料來源', Icon: Icons.Database },
];

export const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <nav
            style={{
                position: 'fixed',
                zIndex: 50,
                fontFamily: 'var(--font-family)',
            }}
            className="
                bottom-0 left-0 right-0
                md:top-0 md:bottom-0 md:right-auto md:w-64
            "
        >
            {/* Glass panel */}
            <div
                className="glass"
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'var(--space-3)',
                    borderRight: '1px solid var(--color-outline-variant)',
                    borderTop: '1px solid var(--color-outline-variant)',
                }}
                // Mobile: border-top only; desktop: border-right only (handled via className media)
            >
                {/* Logo — desktop only */}
                <div className="hidden md:flex" style={{ alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-3)', marginBottom: 'var(--space-6)' }}>
                    <div style={{
                        width: 38, height: 38,
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-card)',
                    }}>
                        <Icons.Wallet size={18} style={{ color: 'var(--color-on-primary-fixed)' }} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 'var(--text-title-md-size)', fontWeight: 800, color: 'var(--color-on-surface)' }}>AssetFlow</h1>
                        <p className="text-label-md" style={{ margin: 0 }}>Portfolio Tracker</p>
                    </div>
                </div>

                {/* Nav items */}
                <div
                    className="flex md:flex-col overflow-x-auto md:overflow-visible no-scrollbar"
                    style={{ gap: 'var(--space-1)' }}
                >
                    {NAV_ITEMS.map(({ tab, label, Icon }) => {
                        const active = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    flexShrink: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 4,
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-family)',
                                    transition: 'background 0.15s, transform 0.1s',
                                    background: active ? 'var(--color-primary-fixed)' : 'transparent',
                                    color: active ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
                                    transform: active ? 'scale(1)' : 'scale(1)',
                                    minWidth: 56,
                                }}
                                className="md:flex-row md:justify-start md:gap-3 md:px-4"
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--color-surface-container-high)'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <Icon size={20} />
                                <span style={{
                                    fontSize: 'var(--text-label-md-size)',
                                    fontWeight: 800,
                                    letterSpacing: '0.03em',
                                    whiteSpace: 'nowrap',
                                }}
                                    className="text-[10px] md:text-sm"
                                >
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};
