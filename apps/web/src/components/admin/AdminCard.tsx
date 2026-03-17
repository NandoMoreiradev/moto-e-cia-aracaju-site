'use client';

import React from 'react';

interface AdminCardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
  noPadding?: boolean;
}

export const AdminCard: React.FC<AdminCardProps> = ({ title, children, style, noPadding }) => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      border: '1px solid #f0f0f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
      overflow: 'hidden',
      ...style
    }}>
      {title && (
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f8f9fa',
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 700,
            color: '#111',
            letterSpacing: '-0.01em'
          }}>
            {title}
          </h3>
        </div>
      )}
      <div style={{ padding: noPadding ? 0 : '24px' }}>
        {children}
      </div>
    </div>
  );
};
