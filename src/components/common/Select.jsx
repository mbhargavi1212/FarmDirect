import React from 'react';
export const Select = ({ label, helperText, error, options, className = '', id, ...props }) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (<div className="w-full">
      {label && (<label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>)}
      <div className="relative">
        <select id={selectId} className={`w-full bg-white border text-sm text-slate-900 rounded-xl px-3.5 py-2.5 appearance-none pr-10 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 disabled:bg-slate-50 disabled:text-slate-500 ${error
            ? 'border-rose-300 focus:border-rose-500'
            : 'border-slate-300 hover:border-slate-400'} ${className}`} {...props}>
          {options.map((opt) => (<option key={opt.value} value={opt.value}>
              {opt.label} {opt.subLabel ? `(${opt.subLabel})` : ''}
            </option>))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
          </svg>
        </div>
      </div>
      {error ? (<p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>) : helperText ? (<p className="mt-1 text-xs text-slate-500">{helperText}</p>) : null}
    </div>);
};
