import React from 'react';
import { Icons } from './Icons';

export const DataSource = ({ sheetUrl, setSheetUrl, error, loading, refresh }) => {
    const connected = !error && sheetUrl && !loading;

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', fontFamily: 'var(--font-family)' }}>

            {/* Main settings card */}
            <div style={{ backgroundColor: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-none)', padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ width: 44, height: 44, border: '1px solid var(--color-hairline-strong)', backgroundColor: 'var(--color-surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icons.Database size={18} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                        <h2 className="text-title-lg" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>資料來源設定 (DATA SOURCE)</h2>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-muted)' }}>串接您的 Google Apps Script 以獲取即時持股與歷史數據</p>
                    </div>
                </div>

                <label 
                    className="text-label-uppercase" 
                    style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '1px' }}
                >
                    Google Apps Script Web App URL
                </label>

                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <input
                        type="text"
                        placeholder="https://script.google.com/macros/s/..."
                        className="text-input"
                        value={sheetUrl}
                        onChange={(e) => setSheetUrl(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button
                        onClick={refresh}
                        disabled={loading || !sheetUrl}
                        className="btn-primary"
                        style={{
                            flexShrink: 0,
                            height: '48px',
                        }}
                    >
                        <Icons.RefreshedCcw size={14} className={loading ? 'animate-spin' : ''} style={{ marginRight: '6px' }} />
                        {loading ? '同步中...' : '立即同步'}
                    </button>
                </div>

                {error && (
                    <div style={{
                        marginTop: 'var(--space-md)',
                        background: 'var(--color-canvas)',
                        border: '1px solid var(--color-error)',
                        borderRadius: 'var(--radius-none)',
                        padding: 'var(--space-md) var(--space-lg)',
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: 'var(--space-xs)',
                    }}>
                        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-error)', fontSize: '14px' }}>連線失敗</p>
                            <p style={{ margin: '2px 0 0', fontWeight: 300, color: 'var(--color-muted)', fontSize: '13px' }}>{error}</p>
                        </div>
                    </div>
                )}

                {connected && (
                    <div style={{
                        marginTop: 'var(--space-md)',
                        backgroundColor: 'var(--color-surface-soft)',
                        border: '1px solid var(--color-hairline)',
                        borderRadius: 'var(--radius-none)',
                        padding: 'var(--space-md) var(--space-lg)',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--space-sm)',
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)', flexShrink: 0 }} />
                        <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-success)', fontSize: '13px', letterSpacing: '0.5px' }}>
                            STATUS: CONNECTED (已成功同步資料來源)
                        </p>
                    </div>
                )}
            </div>

            {/* Setup guide */}
            <div style={{
                backgroundColor: 'var(--color-surface-soft)',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--radius-none)',
                padding: 'var(--space-md)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 'var(--space-sm)',
            }}>
                {[
                    {
                        step: '01',
                        title: '部署 GAS 程式',
                        body: <>請將 <code style={{ fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '0.9em' }}>backend/Code.js</code> 的內容複製到 Google Apps Script 編輯器，並部署為「網路應用程式」。</>
                    },
                    {
                        step: '02',
                        title: '取得網址',
                        body: <>部署後的網址格式為 <code style={{ fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '0.9em' }}>https://script.google.com/macros/s/.../exec</code>。</>
                    },
                ].map(({ step, title, body }) => (
                    <div 
                        key={step} 
                        className="configurator-option-tile"
                        style={{ 
                            backgroundColor: 'var(--color-canvas)', 
                            cursor: 'default',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-xs)'
                        }}
                    >
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, letterSpacing: '1px', color: 'var(--color-primary)' }}>STEP {step}.</p>
                        <h3 className="text-title-sm" style={{ margin: 0, color: 'var(--color-ink)' }}>{title}</h3>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 300, color: 'var(--color-body)', lineHeight: 1.6 }}>{body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
