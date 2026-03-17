import React from 'react';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const AdminInput: React.FC<AdminInputProps> = ({ label, icon, style, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{
        fontSize: '13px',
        fontWeight: 700,
        color: '#666',
        marginLeft: '4px'
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            {icon}
          </div>
        )}
        <input
          {...props}
          style={{
            width: '100%',
            padding: icon ? '12px 12px 12px 40px' : '12px 16px',
            background: '#fcfcfc',
            border: '1px solid #e5e5e5',
            borderRadius: '10px',
            fontSize: '14px',
            color: '#111',
            outline: 'none',
            transition: 'all 0.2s',
            boxShadow: 'none',
            ...style
          }}
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
    </div>
  );
};
