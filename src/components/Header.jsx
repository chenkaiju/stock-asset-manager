import React from 'react';
import { Icons } from './Icons';

export const Header = ({ loading, error }) => {
  return (
    <>
      {loading && (
        <div
          className="flex items-center gap-2 text-sm mb-6"
          style={{
            color: 'var(--color-primary)',
            fontWeight: 800,
            letterSpacing: 'var(--text-label-md-tracking)',
            textTransform: 'uppercase',
            fontSize: 'var(--text-label-md-size)',
          }}
        >
          <Icons.RefreshedCcw size={14} className="animate-spin" style={{ color: 'var(--color-primary-fixed)' }} />
          正在同步資料...
        </div>
      )}

      {error && (
        <div
          className="mb-6 flex items-center gap-3"
          style={{
            background: 'var(--color-surface-container-low)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.5rem',
            boxShadow: 'inset 0 0 0 1px var(--color-outline-variant)',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
          <span style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-lg-size)', fontWeight: 500 }}>
            連線錯誤：{error}。請至設定頁確認 URL。
          </span>
        </div>
      )}
    </>
  );
};
