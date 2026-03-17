'use client';

import React from 'react';

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const AdminTextarea: React.FC<AdminTextareaProps> = ({ label, style, ...props }) => {
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
      <textarea
        style={{
          width: '100%',
          padding: '11px 14px',
          background: '#fcfcfc',
          border: '1px solid #e5e5e5',
          borderRadius: '10px',
          fontSize: '14px',
          color: '#111',
          transition: 'all 0.2s',
          minHeight: '100px',
          resize: 'vertical',
          ...style
        }}
        {...props}
        onFocus={e => {
          e.currentTarget.style.borderColor = '#E2231A';
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(226, 35, 26, 0.1)';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = '#e5e5e5';
          e.currentTarget.style.background = '#fcfcfc';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};
