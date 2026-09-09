import React from 'react';
export const Input = ({ label, helperText, error, icon: Icon, prefixText, suffixText, className = '', id, ...props }) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (<div className="w-full">
      {label && (<label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>)}
      <div className="relative flex items-center">
        {Icon && (<div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4"/>
          </div>)}
        {prefixText && (<span className="absolute left-3.5 text-sm font-medium text-slate-500 pointer-events-none">
            {prefixText}
          </span>)}
        <input id={inputId} className={`w-full bg-white border text-sm text-slate-900 rounded-xl px-3.5 py-2.5 transition-all duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 disabled:bg-slate-50 disabled:text-slate-500 ${error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-300 hover:border-slate-400'} ${Icon ? 'pl-10' : ''} ${prefixText ? 'pl-8' : ''} ${suffixText ? 'pr-12' : ''} ${className}`} {...props}/>
        {suffixText && (<span className="absolute right-3.5 text-xs font-medium text-slate-400 pointer-events-none">
            {suffixText}
          </span>)}
      </div>
      {error ? (<p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>) : helperText ? (<p className="mt-1 text-xs text-slate-500">{helperText}</p>) : null}
    </div>);
};
