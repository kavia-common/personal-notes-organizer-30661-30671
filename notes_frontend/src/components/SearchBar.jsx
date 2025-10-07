import React from 'react';

// PUBLIC_INTERFACE
export default function SearchBar({ value, onChange, placeholder = 'Search notes…', 'aria-label': ariaLabel = 'Search notes' }) {
  /** Accessible themed search bar with leading icon. */
  return (
    <div className="searchbar" style={containerStyle}>
      <div aria-hidden="true" style={iconWrapStyle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        style={inputStyle}
      />
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 560,
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 9999,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  padding: '6px 12px',
  gap: 8
};

const iconWrapStyle = {
  display: 'grid',
  placeItems: 'center'
};

const inputStyle = {
  appearance: 'none',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  width: '100%',
  padding: '8px 8px',
  fontSize: 14,
  color: '#111827',
  borderRadius: 9999,
  transition: 'box-shadow 120ms, border-color 120ms'
};
