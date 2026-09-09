import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors',
    flat: 'bg-slate-50 border border-transparent',
    bordered: 'bg-white border-2 border-slate-200',
  };
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const hasHeader = Boolean(title || subtitle || headerAction);

  return (
    <div
      className={`rounded-2xl ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
          <div>
            {title && (
              <h3 className="font-bold text-base text-slate-900 font-heading">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

