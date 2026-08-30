import React, { useState } from 'react';
import { UserProgress, Lesson } from '../types';
import { MODULES } from '../data/lessonsData';
import { soundFX } from '../utils/soundEffects';
import {
  User,
  Zap,
  Flame,
  Award,
  Star,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Lock,
  ChevronRight,
  Shield,
  Trash2,
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileViewProps {
  progress: UserProgress;
  levelInfo: { level: number; title: string; currentLevelXp: number; nextLevelXp: number; progressPercent: number };
  onReplayLesson: (lesson: Lesson) => void;
  onResetProgress: () => void;
}

export default function ProfileView({
  progress,
  levelInfo,
  onReplayLesson,
  onResetProgress
}: ProfileViewProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Collect all lessons flat
  const allLessons = MODULES.flatMap(m => m.lessons);
  const completedLessons = allLessons.filter(l => progress.completedLessonIds.includes(l.id));

  const totalPossibleStars = allLessons.length * 3;
  const earnedStars = Object.values(progress.lessonStars).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Profile Header & Level Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-300">
              <User className="w-7 h-7" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-100">Git Разработчик</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800/50">
                Ур. {levelInfo.level}
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-400 mt-0.5">
              {levelInfo.title}
            </p>
          </div>
        </div>

        {/* Level XP Progress */}
        <div className="mt-4 space-y-1.5 relative z-10">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Прогресс до следующего ранга</span>
            <span className="font-mono text-cyan-300 font-bold">
              {progress.xp} / {levelInfo.nextLevelXp} XP
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Stats 3-Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 text-center space-y-1">
          <Flame className="w-5 h-5 text-amber-400 mx-auto" />
          <div className="text-base font-extrabold text-slate-100 font-mono">
            {progress.streakDays}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Дней подряд</div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 text-center space-y-1">
          <Star className="w-5 h-5 text-amber-400 mx-auto fill-amber-400/20" />
          <div className="text-base font-extrabold text-slate-100 font-mono">
            {earnedStars} <span className="text-[10px] text-slate-500 font-normal">/{totalPossibleStars}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Звёзд получено</div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 text-center space-y-1">
          <BookOpen className="w-5 h-5 text-cyan-400 mx-auto" />
          <div className="text-base font-extrabold text-slate-100 font-mono">
            {progress.completedLessonIds.length} <span className="text-[10px] text-slate-500 font-normal">/{allLessons.length}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Уроков пройдено</div>
        </div>
      </div>

      {/* REPEAT / REPLAY LESSONS SECTION */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Повторение пройденных уроков
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {completedLessons.length} доступно
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Если какая-то тема осталась непонятной, вы можете перепройти любой завершенный урок в любое время:
        </p>

        {completedLessons.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {completedLessons.map(lesson => {
              const stars = progress.lessonStars[lesson.id] || 0;
              return (
                <div
                  key={lesson.id}
                  className="bg-slate-950/70 rounded-2xl border border-slate-800/80 p-3 flex items-center justify-between gap-2 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-200 truncate">
                      {lesson.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map(s => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= stars
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundFX.playTap();
                      onReplayLesson(lesson);
                    }}
                    className="shrink-0 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Повторить</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 text-center text-xs text-slate-500">
            Вы пока не завершили ни одного урока. Пройдите первый урок на вкладке «Обучение»!
          </div>
        )}
      </div>

      {/* ACHIEVEMENTS / BADGES */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Достижения
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {progress.achievements.filter(a => a.unlocked).length} / {progress.achievements.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {progress.achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                ach.unlocked
                  ? 'bg-slate-950/80 border-amber-500/30 shadow-sm'
                  : 'bg-slate-950/30 border-slate-800/60 opacity-60'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  ach.unlocked
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-600'
                }`}
              >
                {ach.unlocked ? <Award className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 truncate">
                    {ach.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  {ach.description}
                </p>
                {ach.progress && !ach.unlocked && (
                  <div className="text-[10px] text-cyan-400 font-mono mt-1">
                    Прогресс: {ach.progress.current} / {ach.progress.max}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DANGER ZONE: RESET PROGRESS */}
      <div className="bg-rose-950/20 rounded-3xl border border-rose-900/30 p-4 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          Сброс и управление данными
        </h3>
        <p className="text-xs text-rose-200/70 leading-relaxed">
          Если вы хотите начать обучение Git с чистого листа, вы можете полностью сбросить весь прогресс, опыт и звёзды.
        </p>
        <button
          onClick={() => {
            soundFX.playTap();
            setShowResetConfirm(true);
          }}
          className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500 text-rose-400 active:text-white border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Сбросить весь прогресс</span>
        </button>
      </div>

      {/* Modal Confirmation for Reset */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-100">
                  Сбросить весь прогресс?
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Все набранные очки опыта (XP), заработанные звёзды, открытые достижения и пройденные уроки будут обнулены. Это действие нельзя отменить.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundFX.playTap();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    soundFX.playMistake();
                    onResetProgress();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg transition-colors"
                >
                  Да, сбросить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
