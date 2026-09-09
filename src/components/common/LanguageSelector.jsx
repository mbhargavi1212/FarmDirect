import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
export const LanguageSelector = ({ variant = 'compact', className = '', }) => {
    const { language, setLanguage, languages, currentLanguageOption } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // 1. Segmented pill buttons (best for Login page and featured cards)
    if (variant === 'segmented') {
        return (<div className={`inline-flex items-center p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-2xs ${className}`}>
        <div className="flex items-center gap-1.5 px-2 text-slate-400 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5 text-emerald-600"/>
          <span className="hidden sm:inline">Language:</span>
        </div>
        <div className="flex items-center gap-1">
          {languages.map((lang) => {
                const isSelected = language === lang.code;
                return (<button key={lang.code} type="button" onClick={() => setLanguage(lang.code)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                        ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/70'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'}`} aria-pressed={isSelected}>
                <span>{lang.nativeName}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"/>}
              </button>);
            })}
        </div>
      </div>);
    }
    // 2. Compact dropdown (default for Headers and Navbars)
    return (<div className={`relative ${className}`} ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/70 text-xs font-medium text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-2xs" aria-expanded={isOpen} aria-haspopup="listbox">
        <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0"/>
        <span className="font-semibold">{currentLanguageOption.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
      </button>

      {isOpen && (<div role="listbox" className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
            Select Language • భాష • भाषा
          </div>
          {languages.map((lang) => {
                const isSelected = language === lang.code;
                return (<button key={lang.code} type="button" role="option" aria-selected={isSelected} onClick={() => {
                        setLanguage(lang.code);
                        setIsOpen(false);
                    }} className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${isSelected
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'}`}>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200/60 flex items-center justify-center text-[10px] font-bold text-slate-600">
                    {lang.badge}
                  </span>
                  <div>
                    <p className="leading-tight">{lang.nativeName}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{lang.name}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600"/>}
              </button>);
            })}
        </div>)}
    </div>);
};
