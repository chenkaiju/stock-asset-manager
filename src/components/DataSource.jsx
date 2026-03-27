import React from 'react';
import { Icons } from './Icons';

export const DataSource = ({ sheetUrl, setSheetUrl, error, loading, refresh }) => {
    const connected = !error && sheetUrl && !loading;

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

            {/* Main settings card */}
            <div style={{ background: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1px 2px rgba(56,56,49,0.10)' }}>
                        <Icons.Database size={22} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 'var(--text-headline-md-size)', fontWeight: 800, color: 'var(--color-on-surface)' }}>資料來源設定</h2>
                        <p className="text-label-md" style={{ margin: 0 }}>串接您的 Google Apps Script 以獲取即時資料</p>
                    </div>
                </div>

                <label className="text-label-md" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>
                    Google Apps Script Web App URL
                </label>

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <input
                        type="text"
                        placeholder="https://script.google.com/macros/s/..."
                        className="input-pill"
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
                            opacity: (loading || !sheetUrl) ? 0.5 : 1,
                            cursor: (loading || !sheetUrl) ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <Icons.RefreshedCcw size={16} className={loading ? 'animate-spin' : ''} />
                        {loading ? '同步中...' : '立即同步'}
                    </button>
                </div>

                {error && (
                    <div style={{
                        marginTop: 'var(--space-5)',
                        background: 'var(--color-surface-container-low)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4) var(--space-5)',
                        display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                        boxShadow: 'inset 0 0 0 1px var(--color-outline-variant)',
                    }}>
                        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: 800, color: 'var(--color-on-surface)' }}>連線失敗</p>
                            <p style={{ margin: '4px 0 0', fontWeight: 500, color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-lg-size)' }}>{error}</p>
                        </div>
                    </div>
                )}

                {connected && (
                    <div style={{
                        marginTop: 'var(--space-5)',
                        background: 'var(--color-surface-container-low)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4) var(--space-5)',
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2d7a4f', flexShrink: 0, boxShadow: '0 0 0 3px rgba(45,122,79,0.2)' }} className="animate-pulse" />
                        <p style={{ margin: 0, fontWeight: 800, color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-lg-size)' }}>
                            連線正常：已成功串接資料來源
                        </p>
                    </div>
                )}
            </div>

            {/* Setup guide */}
            <div style={{
                background: 'var(--color-surface-container-low)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 'var(--space-3)',
            }}>
                {[
                    {
                        step: '01',
                        title: '部署 GAS 程式',
                        body: <>請將 <code style={{ fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '0.85em' }}>backend/Code.js</code> 的內容複製到 Google Apps Script 編輯器，並部署為「網路應用程式」。</>
                    },
                    {
                        step: '02',
                        title: '取得網址',
                        body: <>部署後的網址格式為 <code style={{ fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '0.85em' }}>https://script.google.com/macros/s/.../exec</code>。</>
                    },
                ].map(({ step, title, body }) => (
                    <div key={step} style={{ background: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)' }}>
                        <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-label-md-size)', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--color-primary)' }}>{step}.</p>
                        <h3 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-title-md-size)', fontWeight: 800, color: 'var(--color-on-surface)' }}>{title}</h3>
                        <p style={{ margin: 0, fontSize: 'var(--text-body-lg-size)', fontWeight: 500, color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>{body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
