import React from 'react';
export const Badge = ({ children, variant = 'neutral', size = 'sm', dot = false, className = '', ...props }) => {
    const variantStyles = {
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
        amber: 'bg-amber-100 text-amber-800 border-amber-300',
        danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
        info: 'bg-sky-50 text-sky-700 border-sky-200/80',
        neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    const dotColors = {
        success: 'bg-emerald-500',
        emerald: 'bg-emerald-600',
        warning: 'bg-amber-500',
        amber: 'bg-amber-600',
        danger: 'bg-rose-500',
        info: 'bg-sky-500',
        neutral: 'bg-slate-400',
    };
    const sizeStyles = {
        sm: 'text-xs px-2.5 py-0.5 rounded-full',
        md: 'text-sm px-3 py-1 rounded-full font-medium',
    };
    return (<span className={`inline-flex items-center gap-1.5 border font-medium whitespace-nowrap ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}/>}
      {children}
    </span>);
};
