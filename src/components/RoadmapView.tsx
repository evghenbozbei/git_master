import React, { useState } from 'react';
import { Module, Lesson, UserProgress } from '../types';
import { MODULES } from '../data/lessonsData';
import {
  GitCommit,
  GitBranch,
  Cloud,
  RotateCcw,
  Zap,
  Star,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoadmapViewProps {
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
}

export default function RoadmapView({ progress, onSelectLesson }: RoadmapViewProps) {
  const [expandedModuleId, setExpandedModuleId] = useState<string>('mod_1');

  const allLessons = MODULES.flatMap(m => m.lessons);
  const completedCount = progress.completedLessonIds.length;
  const completionPercent = Math.round((completedCount / allLessons.length) * 100);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'GitCommit':
        return <GitCommit className="w-5 h-5" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5" />;
      case 'RotateCcw':
        return <RotateCcw className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      default:
        return <GitCommit className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Course Progress Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
              Путь Git-Мастера
            </span>
            <h2 className="text-sm font-extrabold text-slate-100 mt-1">
              Программа Обучения
            </h2>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-cyan-400 font-mono">
              {completionPercent}%
            </span>
            <span className="text-[10px] text-slate-400 block">пройдено</span>
          </div>
        </div>

        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <motion.div
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        {MODULES.map(module => {
          const isExpanded = expandedModuleId === module.id;
          const completedInModule = module.lessons.filter(l =>
            progress.completedLessonIds.includes(l.id)
          ).length;
          const isModuleFullyCompleted = completedInModule === module.lessons.length;

          return (
            <div
              key={module.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-lg transition-all"
            >
              {/* Module Header / Accordion trigger */}
              <button
                onClick={() => setExpandedModuleId(isExpanded ? '' : module.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${module.color}18`,
                      borderColor: `${module.color}40`,
                      color: module.color
                    }}
                  >
                    {getModuleIcon(module.iconName)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Модуль {module.number}
                      </span>
                      {isModuleFullyCompleted && (
                        <span className="text-[9px] font-bold bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800/60 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Сдан
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-100 truncate mt-0.5">
                      {module.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-2">
                  <span className="text-xs font-mono text-slate-400">
                    {completedInModule}/{module.lessons.length}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Module Description & Lessons List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-slate-800/80 px-4 pb-4 pt-2 space-y-2.5 bg-slate-950/40"
                  >
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {module.description}
                    </p>

                    <div className="space-y-2 pt-1">
                      {module.lessons.map((lesson, lIdx) => {
                        const isCompleted = progress.completedLessonIds.includes(lesson.id);
                        const stars = progress.lessonStars[lesson.id] || 0;

                        // Easy unlocking rule: Module 1 is always unlocked, other lessons unlock progressively or open
                        return (
                          <div
                            key={lesson.id}
                            onClick={() => onSelectLesson(lesson)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isCompleted
                                ? 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/60'
                                : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-400">
                                  {module.number}.{lIdx + 1}
                                </span>
                                <span className="text-[10px] font-semibold bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
                                  {lesson.difficulty}
                                </span>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {lesson.durationMinutes} мин
                                </span>
                              </div>

                              <h4 className="text-xs font-bold text-slate-100 mt-1 line-clamp-1">
                                {lesson.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {lesson.shortDesc}
                              </p>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              {isCompleted ? (
                                <div className="flex flex-col items-end gap-1">
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
                                  <span className="text-[9px] text-emerald-400 font-medium">Пройден</span>
                                </div>
                              ) : (
                                <div className="p-2 bg-cyan-500/10 text-cyan-300 rounded-xl border border-cyan-500/20">
                                  <Play className="w-3.5 h-3.5 fill-cyan-300" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
