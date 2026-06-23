import React, { useState } from 'react';
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
    const [isOpen, setIsOpen] = useState(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setIsOpen(false);
    };

    return (
        <>
            {/* Top Navigation Bar */}
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '64px',
                    backgroundColor: 'var(--color-canvas)',
                    borderBottom: '1px solid var(--color-hairline)',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 var(--space-lg)',
                    fontFamily: 'var(--font-family)',
                }}
            >
                {/* Brand / Logo */}
                <div 
                    onClick={() => handleTabClick('dashboard')}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--space-sm)',
                        cursor: 'pointer',
                        userSelect: 'none'
                    }}
                >
                    {/* Brand Logo */}
                    <img 
                        src="/Stock-Logo.svg" 
                        alt="Portfolio X Logo" 
                        style={{
                            width: '32px',
                            height: '32px',
                            objectFit: 'contain'
                        }}
                    />
                    <div>
                        <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--color-ink)', lineHeight: 1.1 }}>
                            Portfolio X
                        </h1>
                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>
                            KAIJU CHEN
                        </p>
                    </div>
                </div>

                {/* Desktop Menu - Center */}
                <nav className="hidden md:flex" style={{ height: '100%', alignItems: 'center', gap: 'var(--space-lg)' }}>
                    {NAV_ITEMS.map(({ tab, label }) => {
                        const active = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                style={{
                                    height: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent',
                                    color: active ? 'var(--color-ink)' : 'var(--color-muted)',
                                    fontSize: '14px',
                                    fontWeight: active ? 700 : 400,
                                    letterSpacing: '0.3px',
                                    padding: '0 var(--space-xs)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'color 0.15s ease, border-color 0.15s ease',
                                    fontFamily: 'var(--font-family)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!active) e.currentTarget.style.color = 'var(--color-ink)';
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) e.currentTarget.style.color = 'var(--color-muted)';
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </nav>

                {/* Right Area (Desktop) or Hamburger Toggle (Mobile) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    {/* Live Sync Status Pill */}
                    <div className="hidden lg:flex" style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--color-success)',
                        border: '1px solid var(--color-success)',
                        padding: '4px 10px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        ONLINE
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        className="flex md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-ink)',
                            padding: 'var(--space-xs)',
                        }}
                    >
                        {isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="6" x2="20" y2="6" />
                                <line x1="4" y1="18" x2="20" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Spacer to push content down below fixed nav */}
            <div style={{ height: '64px' }} />

            {/* Mobile Full-Screen Overlay Sheet Menu */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: '64px',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'var(--color-canvas)',
                        zIndex: 99,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 'var(--space-lg)',
                        fontFamily: 'var(--font-family)',
                        borderTop: '1px solid var(--color-hairline)',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                        {NAV_ITEMS.map(({ tab, label, Icon }) => {
                            const active = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => handleTabClick(tab)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-md)',
                                        background: active ? 'var(--color-surface-soft)' : 'transparent',
                                        border: 'none',
                                        color: active ? 'var(--color-primary)' : 'var(--color-ink)',
                                        fontSize: '18px',
                                        fontWeight: active ? 700 : 300, /* Light 300 vs bold 700 */
                                        padding: 'var(--space-md) var(--space-lg)',
                                        textAlign: 'left',
                                        width: '100%',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Icon size={20} style={{ color: active ? 'var(--color-primary)' : 'var(--color-muted)' }} />
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-hairline)', paddingTop: 'var(--space-lg)', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>
                            BMW Corporate Asset System
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
