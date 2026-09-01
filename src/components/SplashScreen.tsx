import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GitBranch, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import appIconUrl from '../assets/images/gitmaster_app_icon_1788120621193.jpg';
import { soundFX } from '../utils/soundEffects';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

const LOADING_STEPS = [
  'Инициализация git init...',
  'Загрузка интерактивных модулей...',
  'Подготовка песочницы терминала...',
  'Готово к работе!'
];

export default function SplashScreen({ onFinish, durationMs = 2400 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / durationMs) * 100), 100);
      setProgress(pct);

      if (pct < 30) {
        setStepIndex(0);
      } else if (pct < 65) {
        setStepIndex(1);
      } else if (pct < 90) {
        setStepIndex(2);
      } else {
        setStepIndex(3);
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        soundFX.playTap();
        setTimeout(onFinish, 200);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [durationMs, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950 text-slate-100 p-6 select-none overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="pt-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-cyan-300 shadow-sm"
      >
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>v1.2 Interactive Edition</span>
      </motion.div>

      {/* Center Icon & Branding */}
      <div className="flex flex-col items-center text-center space-y-4 my-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.15
          }}
          className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/25 border-2 border-cyan-500/40 p-0.5 bg-gradient-to-tr from-cyan-500/30 to-emerald-500/30"
        >
          <img
            src={appIconUrl}
            alt="GitMaster Logo"
            className="w-full h-full object-cover rounded-[22px]"
            referrerPolicy="no-referrer"
          />
          {/* Subtle pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl border-2 border-cyan-400 pointer-events-none"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="space-y-1"
        >
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>GIT</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              MASTER
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xs">
            Тренажёр и симулятор команд Git от новичка до мастера
          </p>
        </motion.div>
      </div>

      {/* Bottom Progress Bar & Step Info */}
      <div className="w-full max-w-xs space-y-3 pb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-cyan-300">
            {progress === 100 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Terminal className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            )}
            {LOADING_STEPS[stepIndex]}
          </span>
          <span className="font-bold text-slate-300">{progress}%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* Fast skip button */}
        <button
          onClick={() => {
            soundFX.playTap();
            onFinish();
          }}
          className="w-full text-center text-[11px] text-slate-500 hover:text-slate-300 transition-colors pt-1"
        >
          Нажмите, чтобы пропустить ➔
        </button>
      </div>
    </motion.div>
  );
}
