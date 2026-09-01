import React, { useState } from 'react';
import {
  Map,
  Zap,
  Terminal,
  BookMarked,
  User,
  Flame,
  Star,
  GitBranch,
  Volume2,
  VolumeX
} from 'lucide-react';
import appIconUrl from '../assets/images/gitmaster_app_icon_1788120621193.jpg';
import { UserProgress } from '../types';
import { soundFX } from '../utils/soundEffects';

export type ActiveScreen = 'roadmap' | 'practice' | 'terminal' | 'cheatsheet' | 'profile';

interface NavigationProps {
  activeScreen: ActiveScreen;
  onChangeScreen: (screen: ActiveScreen) => void;
  progress: UserProgress;
  levelInfo: { level: number; title: string; currentLevelXp: number; nextLevelXp: number; progressPercent: number };
}

export default function Navigation({
  activeScreen,
  onChangeScreen,
  progress,
  levelInfo
}: NavigationProps) {
  const [isMuted, setIsMuted] = useState(() => soundFX.getIsMuted());

  const toggleSound = () => {
    const nextMuted = soundFX.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleNavClick = (screen: ActiveScreen) => {
    soundFX.playNavClick();
    onChangeScreen(screen);
  };

  const navItems: { id: ActiveScreen; label: string; icon: React.ReactNode }[] = [
    { id: 'roadmap', label: 'Обучение', icon: <Map className="w-5 h-5" /> },
    { id: 'practice', label: 'Тренажёр', icon: <Zap className="w-5 h-5" /> },
    { id: 'terminal', label: 'Терминал', icon: <Terminal className="w-5 h-5" /> },
    { id: 'cheatsheet', label: 'Справка', icon: <BookMarked className="w-5 h-5" /> },
    { id: 'profile', label: 'Профиль', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => handleNavClick('roadmap')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-cyan-500/20 border border-cyan-500/30 shrink-0">
            <img
              src={appIconUrl}
              alt="GitMaster"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-tight text-slate-100 uppercase">
              Git<span className="text-cyan-400">Master</span>
            </h1>
            <span className="text-[10px] text-emerald-400 font-semibold block -mt-0.5">
              {levelInfo.title}
            </span>
          </div>
        </div>

        {/* Stats Badges & Sound Toggle */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-xl border transition-colors ${
              isMuted
                ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
            }`}
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Streak */}
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-xl text-xs font-bold text-amber-400">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{progress.streakDays}</span>
          </div>

          {/* XP */}
          <div
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/30 px-2 py-1 rounded-xl text-xs font-bold text-cyan-300 cursor-pointer hover:bg-cyan-500/20 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>{progress.xp} XP</span>
          </div>
        </div>
      </header>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 max-w-md mx-auto">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map(item => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
