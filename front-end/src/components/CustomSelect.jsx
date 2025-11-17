import React, { useEffect, useRef, useState } from 'react';

const CustomSelect = ({ name, label, value, onChange, options = [], placeholder = 'Select' }) => {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!open) setHighlight(-1);
  }, [open]);

  const handleKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'ArrowDown') setHighlight((h) => Math.min(h + 1, options.length - 1));
    if (e.key === 'ArrowUp') setHighlight((h) => Math.max(h - 1, 0));
    if (e.key === 'Enter' && highlight >= 0) {
      const opt = options[highlight];
      onChange({ target: { name, value: opt.value } });
      setOpen(false);
    }
  };

  const selectedLabel = options.find((o) => o.value === value)?.label || '';

  return (
    <div className="custom-select" ref={ref} onKeyDown={handleKeyDown} tabIndex={0} aria-haspopup="listbox">
      <button
        type="button"
        className={`custom-select-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-controls={`${name}-listbox`}
      >
        <span className={`custom-select-value ${selectedLabel ? '' : 'placeholder'}`}>
          {selectedLabel || placeholder}
        </span>
        <span className="custom-select-caret" aria-hidden>▾</span>
      </button>

      <div className={`custom-select-panel ${open ? 'visible' : ''}`} role="listbox" id={`${name}-listbox`} tabIndex={-1}>
        {options.length === 0 ? (
          <div className="custom-select-empty">No options</div>
        ) : (
          options.map((opt, idx) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              className={`custom-select-item ${highlight === idx ? 'highlight' : ''} ${value === opt.value ? 'selected' : ''}`}
              onMouseEnter={() => setHighlight(idx)}
              onClick={() => {
                onChange({ target: { name, value: opt.value } });
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
