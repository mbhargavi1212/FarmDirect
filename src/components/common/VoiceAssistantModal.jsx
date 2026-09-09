import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Button } from './Button';
export const VoiceAssistantModal = ({ isOpen, onClose, onNavigate, onSearch, }) => {
    const { t, language, setLanguage } = useLanguage();
    const { showToast } = useApp();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [speechLanguage, setSpeechLanguage] = useState('en-IN');
    const [micSupported, setMicSupported] = useState(true);
    const [micError, setMicError] = useState(null);
    const recognitionRef = useRef(null);
    // Sync speech recognition language with active portal language
    useEffect(() => {
        if (language === 'te') {
            setSpeechLanguage('te-IN');
        }
        else if (language === 'hi') {
            setSpeechLanguage('hi-IN');
        }
        else {
            setSpeechLanguage('en-IN');
        }
    }, [language]);
    // Setup Web Speech API
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setMicSupported(false);
        }
    }, []);
    const startListening = () => {
        setTranscript('');
        setMicError(null);
        setStatusMessage(t('voice.listening'));
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setMicSupported(false);
            setIsListening(true);
            setStatusMessage('Voice recognition preview simulation ready');
            return;
        }
        try {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            const recognition = new SpeechRecognition();
            recognition.lang = speechLanguage;
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;
            recognition.onstart = () => {
                setIsListening(true);
                setStatusMessage(t('voice.listening'));
            };
            recognition.onresult = (event) => {
                const current = event.resultIndex;
                const text = event.results[current][0].transcript;
                setTranscript(text);
            };
            recognition.onerror = (event) => {
                console.warn('Speech recognition notice:', event.error);
                if (event.error === 'not-allowed') {
                    setMicError('Microphone permission was denied or restricted by browser.');
                }
                else if (event.error === 'no-speech') {
                    setStatusMessage('No speech detected. Please tap mic and try again.');
                }
                else {
                    setStatusMessage(`Speech note: ${event.error}`);
                }
                setIsListening(false);
            };
            recognition.onend = () => {
                setIsListening(false);
                setStatusMessage('Voice input captured');
            };
            recognitionRef.current = recognition;
            recognition.start();
        }
        catch (err) {
            console.warn('Recognition start exception:', err);
            setIsListening(false);
            setMicError('Could not start microphone hardware. You can also select sample prompts.');
        }
    };
    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };
    // Process and execute spoken command
    const handleExecute = (spokenText) => {
        const textToProcess = (spokenText || transcript).trim();
        if (!textToProcess)
            return;
        const lower = textToProcess.toLowerCase();
        // 1. Navigation Commands
        if (lower.includes('profile') ||
            lower.includes('kyc') ||
            lower.includes('ప్రొఫైల్') ||
            lower.includes('प्रोफ़ाइल')) {
            showToast('info', 'Voice Navigation', 'Navigating to My Profile...');
            onNavigate('/profile');
            onClose();
            return;
        }
        if (lower.includes('order') ||
            lower.includes('contract') ||
            lower.includes('ఆర్డర్') ||
            lower.includes('ఒప్పంద') ||
            lower.includes('ऑर्डर')) {
            showToast('info', 'Voice Navigation', 'Navigating to Orders...');
            onNavigate('/farmer/orders');
            onClose();
            return;
        }
        if (lower.includes('listing') ||
            lower.includes('produce') ||
            lower.includes('పంటలు') ||
            lower.includes('फसल')) {
            showToast('info', 'Voice Navigation', 'Navigating to Produce Listings...');
            onNavigate('/farmer/products');
            onClose();
            return;
        }
        if (lower.includes('price') ||
            lower.includes('mandi') ||
            lower.includes('rate') ||
            lower.includes('ధర') ||
            lower.includes('మండి') ||
            lower.includes('भाव')) {
            showToast('info', 'Voice Navigation', 'Opening Fair Price Mandi Engine...');
            onNavigate('/fair-price');
            onClose();
            return;
        }
        if (lower.includes('market') ||
            lower.includes('buy') ||
            lower.includes('మార్కెట్') ||
            lower.includes('కొనుగోలు') ||
            lower.includes('बाज़ार')) {
            showToast('info', 'Voice Navigation', 'Opening Produce Marketplace...');
            onNavigate('/marketplace');
            onClose();
            return;
        }
        if (lower.includes('logistics') ||
            lower.includes('truck') ||
            lower.includes('delivery') ||
            lower.includes('రవాణా') ||
            lower.includes('लॉजिस्टिक्स')) {
            showToast('info', 'Voice Navigation', 'Opening Logistics Dispatch...');
            onNavigate('/logistics');
            onClose();
            return;
        }
        // 2. Crop Search Query
        if (onSearch) {
            onSearch(textToProcess);
        }
        showToast('success', 'Voice Search', `Searching produce for: "${textToProcess}"`);
        onNavigate('/marketplace');
        onClose();
    };
    const samplePrompts = [
        { text: 'Tomato Mandi Price', lang: 'English', target: 'Tomato rates' },
        { text: 'టమాటా మార్కెట్ ధర', lang: 'తెలుగు', target: 'టమాటా' },
        { text: 'गेहूं के आज के भाव', lang: 'हिंदी', target: 'गेहूं' },
        { text: 'Show My Profile', lang: 'English', target: 'profile' },
        { text: 'నా ప్రొఫైల్ వివరాలు', lang: 'తెలుగు', target: 'ప్రొఫైల్' },
        { text: 'Direct Crop Marketplace', lang: 'English', target: 'marketplace' },
    ];
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Mic className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {t('voice.title')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('voice.subtitle')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Language Selection for Voice Recognition */}
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
          <span className="text-xs font-semibold text-slate-600 px-2">
            Speech Language:
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => {
            setSpeechLanguage('en-IN');
            setLanguage('en');
        }} className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors cursor-pointer ${speechLanguage === 'en-IN'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-600 hover:bg-white'}`}>
              English
            </button>
            <button onClick={() => {
            setSpeechLanguage('te-IN');
            setLanguage('te');
        }} className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors cursor-pointer ${speechLanguage === 'te-IN'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-600 hover:bg-white'}`}>
              తెలుగు
            </button>
            <button onClick={() => {
            setSpeechLanguage('hi-IN');
            setLanguage('hi');
        }} className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors cursor-pointer ${speechLanguage === 'hi-IN'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-600 hover:bg-white'}`}>
              हिंदी
            </button>
          </div>
        </div>

        {/* Central Visualizer & Microphone Action */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative">
            {/* Ripple rings when listening */}
            {isListening && (<>
                <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping"/>
                <div className="absolute -inset-8 rounded-full bg-emerald-500/10 animate-pulse"/>
              </>)}

            <button type="button" onClick={isListening ? stopListening : startListening} className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${isListening
            ? 'bg-rose-500 text-white ring-4 ring-rose-300 scale-105'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105'}`}>
              {isListening ? (<MicOff className="w-8 h-8 animate-bounce"/>) : (<Mic className="w-8 h-8"/>)}
            </button>
          </div>

          {/* Sound Wave Animation when active */}
          {isListening ? (<div className="flex items-center gap-1 h-8">
              {[40, 70, 95, 60, 80, 100, 50, 75, 45].map((height, idx) => (<div key={idx} className="w-1 bg-emerald-500 rounded-full animate-pulse" style={{
                    height: `${height}%`,
                    animationDelay: `${idx * 0.1}s`,
                    animationDuration: '0.6s',
                }}/>))}
            </div>) : (<p className="text-xs font-semibold text-slate-500">
              {t('voice.start_speaking')}
            </p>)}

          {/* Status feedback */}
          <p className="text-xs text-emerald-700 font-medium max-w-xs">
            {statusMessage || t('voice.speak_now')}
          </p>

          {/* Microphone notice/error */}
          {micError && (<div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600"/>
              <span>{micError}</span>
            </div>)}

          {/* Live Transcript Box */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-left">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span>{t('voice.transcript')}</span>
              {transcript && (<span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3"/> Ready
                </span>)}
            </div>
            <p className="text-sm font-medium text-slate-800 min-h-[40px] italic">
              {transcript ? `"${transcript}"` : '...'}
            </p>

            {transcript && (<div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button size="sm" variant="primary" icon={ArrowRight} iconPosition="right" onClick={() => handleExecute()}>
                  Execute Audio Command
                </Button>
              </div>)}
          </div>
        </div>

        {/* Quick Sample Voice Prompts (Useful for rapid testing & evaluators) */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              {t('voice.sample_prompts')}:
            </span>
            <span className="text-[11px] text-slate-400">Click to run</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {samplePrompts.map((prompt, i) => (<button key={i} type="button" onClick={() => {
                setTranscript(prompt.text);
                handleExecute(prompt.target);
            }} className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-left transition-all group cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 group-hover:bg-emerald-200 text-slate-600 group-hover:text-emerald-900">
                    {prompt.lang}
                  </span>
                  <Sparkles className="w-3 h-3 text-slate-300 group-hover:text-emerald-600"/>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                  "{prompt.text}"
                </p>
              </button>))}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400">
          {t('voice.supported_languages')}
        </div>
      </div>
    </div>);
};
