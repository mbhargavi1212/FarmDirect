import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';
export const StatCard = ({ id, label, value, subtext, icon: Icon, trend, accentColor = 'emerald', }) => {
    const iconBgStyles = {
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        sky: 'bg-sky-50 text-sky-600 border-sky-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    };
    return (<Card id={id} padding="md" className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 font-heading">
            {value}
          </p>
        </div>
        {Icon && (<div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${iconBgStyles[accentColor]}`}>
            <Icon className="w-5 h-5"/>
          </div>)}
      </div>

      {(trend || subtext) && (<div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100 text-xs">
          {trend && (<span className={`inline-flex items-center font-semibold gap-0.5 ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend.isPositive ? (<TrendingUp className="w-3.5 h-3.5"/>) : (<TrendingDown className="w-3.5 h-3.5"/>)}
              {trend.value}
            </span>)}
          {subtext && <span className="text-slate-500 truncate">{subtext}</span>}
        </div>)}
    </Card>);
};
