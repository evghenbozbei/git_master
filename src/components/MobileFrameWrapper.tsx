import React, { useState } from 'react';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
}

export default function MobileFrameWrapper({ children }: MobileFrameWrapperProps) {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start sm:p-4">
      {/* Desktop Helper Toggle */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-2 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Мобильный симулятор</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors ${
              isPhoneFrame ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            Телефон
          </button>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors ${
              !isPhoneFrame ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3 h-3" />
            Широкий
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 min-h-screen sm:min-h-0 ${
          isPhoneFrame
            ? 'max-w-md sm:rounded-[36px] sm:border-2 sm:border-slate-800 sm:shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden bg-slate-950 relative sm:h-[840px] sm:overflow-y-auto scrollbar-thin'
            : 'max-w-3xl bg-slate-950 sm:rounded-3xl sm:border sm:border-slate-800 p-2'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
