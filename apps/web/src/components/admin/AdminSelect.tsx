'use client';

import React from 'react';

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const AdminSelect: React.FC<AdminSelectProps> = ({ label, children, style, ...props }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          fontSize: '13px', 
          fontWeight: 600, 
          color: '#555', 
          marginBottom: '6px' 
        }}>
          {label}
        </label>
      )}
      <select
        style={{
          width: '100%',
          padding: '11px 14px',
          background: '#fcfcfc',
          border: '1px solid #e5e5e5',
          borderRadius: '10px',
          fontSize: '14px',
          color: '#111',
          transition: 'all 0.2s',
          outline: 'none',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          ...style
        }}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
