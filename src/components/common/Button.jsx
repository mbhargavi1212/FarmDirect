import React from 'react';
export const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, iconPosition = 'left', isLoading = false, className = '', disabled, ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap cursor-pointer';
    const sizeStyles = {
        sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
        md: 'text-sm px-4 py-2 rounded-xl gap-2',
        lg: 'text-base px-6 py-3 rounded-xl gap-2.5',
    };
    const variantStyles = {
        primary: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-sm hover:shadow active:scale-[0.99]',
        secondary: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-700 shadow-sm active:scale-[0.99]',
        outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus:ring-emerald-500',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm',
        ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-300',
        success: 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500 shadow-sm',
    };
    return (<button className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? (<span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>) : (Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0"/>)}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && (<Icon className="w-4 h-4 shrink-0"/>)}
    </button>);
};
