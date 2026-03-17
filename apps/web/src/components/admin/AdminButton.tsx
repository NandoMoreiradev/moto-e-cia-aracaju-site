'use client';

import React from 'react';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const AdminButton: React.FC<AdminButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  loading, 
  children, 
  style,
  ...props 
}) => {
  const getStyles = () => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '10px',
      fontWeight: 600,
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      border: 'none',
      gap: '8px',
      fontSize: size === 'sm' ? '13px' : '14px',
      padding: size === 'sm' ? '8px 16px' : (size === 'lg' ? '14px 28px' : '10px 20px'),
      opacity: loading ? 0.7 : 1,
    };

    if (variant === 'primary') {
      return { ...base, background: '#E2231A', color: '#fff', boxShadow: '0 4px 12px rgba(226, 35, 26, 0.2)' };
    }
    if (variant === 'secondary') {
      return { ...base, background: '#f5f5f5', color: '#444', border: '1px solid #e5e5e5' };
    }
    if (variant === 'danger') {
      return { ...base, background: '#fff', color: '#dc3545', border: '1px solid #fee2e2' };
    }
    if (variant === 'ghost') {
      return { ...base, background: 'transparent', color: '#666' };
    }
    return base;
  };

  return (
    <button 
      style={{ ...getStyles(), ...style }} 
      disabled={loading}
      {...props}
      onMouseEnter={e => {
        if (!loading) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          if (variant === 'primary') e.currentTarget.style.boxShadow = '0 6px 16px rgba(226, 35, 26, 0.3)';
        }
      }}
      onMouseLeave={e => {
        if (!loading) {
          e.currentTarget.style.transform = '';
          if (variant === 'primary') e.currentTarget.style.boxShadow = '0 4px 12px rgba(226, 35, 26, 0.2)';
        }
      }}
    >
      {loading ? '...' : children}
    </button>
  );
};
