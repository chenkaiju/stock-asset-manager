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
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontSize: '12px',
            fontFamily: 'var(--font-family)',
          }}
        >
          <Icons.RefreshedCcw size={14} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          正在同步最新資料...
        </div>
      )}

      {error && (
        <div
          className="mb-6 flex items-center gap-3"
          style={{
            background: 'var(--color-canvas)',
            border: '1px solid var(--color-error)',
            borderRadius: 'var(--radius-none)',
            padding: '1rem 1.5rem',
            fontFamily: 'var(--font-family)',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
          <span style={{ color: 'var(--color-error)', fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px' }}>
            連線錯誤：{error}。請至「資料來源」確認部署網址。
          </span>
        </div>
      )}
    </>
  );
};
