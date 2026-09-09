import React from 'react';
export const Tabs = ({ tabs, activeTab, onChange, className = '', }) => {
    return (<div className={`flex border-b border-slate-200 overflow-x-auto gap-2 ${className}`}>
      {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (<button key={tab.id} onClick={() => onChange(tab.id)} className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer select-none ${isActive
                    ? 'border-emerald-600 text-emerald-700 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}>
            {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}/>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (<span className={`text-xs px-2 py-0.5 rounded-full ${isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'}`}>
                {tab.badge}
              </span>)}
          </button>);
        })}
    </div>);
};
