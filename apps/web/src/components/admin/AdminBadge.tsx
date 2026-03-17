'use client';

import React from 'react';

interface AdminBadgeProps {
  children: React.ReactNode;
  color?: string;
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({ children, color = '#888' }) => {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      background: `${color}15`, // Semi-transparent
      color: color,
      border: `1px solid ${color}30`
    }}>
      {children}
    </span>
  );
};
