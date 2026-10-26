import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { UserProgress, Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievementsData';
import { ALL_LESSONS } from '../data/lessonsData';
import { safeStorage } from '../utils/safeStorage';

export const STORAGE_KEY = 'gitmaster_user_progress_v2';
const SAVE_DEBOUNCE_MS = 300;

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: [],
  lessonStars: {},
  completedQuizIds: [],
  completedPuzzleIds: [],
  completedRescueIds: [],
  mistakeQuestionIds: [],
  achievements: INITIAL_ACHIEVEMENTS,
  sandboxCommandsCount: 0
};

export function calculateLevel(xp: number): { level: number; title: string; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  const levels = [
    { level: 1, xpRequired: 0, title: 'Git Новичок' },
    { level: 2, xpRequired: 100, title: 'Git Подмастерье' },
    { level: 3, xpRequired: 250, title: 'Младший Коммитер' },
    { level: 4, xpRequired: 450, title: 'Мастер Веток' },
    { level: 5, xpRequired: 700, title: 'Гуру Слияний' },
    { level: 6, xpRequired: 1000, title: 'Git Архитектор' },
    { level: 7, xpRequired: 1500, title: 'Легенда Git' }
  ];

  let currentLevelObj = levels[0];
  let nextLevelObj = levels[1];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xpRequired) {
      currentLevelObj = levels[i];
      nextLevelObj = levels[i + 1] || { level: currentLevelObj.level + 1, xpRequired: currentLevelObj.xpRequired + 1000, title: 'Git Архитектор' };
      break;
    }
  }

  const range = nextLevelObj.xpRequired - currentLevelObj.xpRequired;
  const currentInLevel = xp - currentLevelObj.xpRequired;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentInLevel / range) * 100)));

  return {
    level: currentLevelObj.level,
    title: currentLevelObj.title,
    currentLevelXp: xp,
    nextLevelXp: nextLevelObj.xpRequired,
    progressPercent
  };
}

const num = (v: unknown, fallback: number): number =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback;

const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

function parseLessonStars(v: unknown): Record<string, number> {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
  const result: Record<string, number> = {};
  for (const [id, stars] of Object.entries(v)) {
    if (typeof stars === 'number' && Number.isFinite(stars)) {
      result[id] = Math.min(3, Math.max(0, Math.round(stars)));
    }
  }
  return result;
}

// Definitions (title, description, rarity...) always come from code; storage only supplies
// unlock state. Malformed entries are ignored and newly added achievements show up for old users.
function mergeAchievements(saved: unknown): Achievement[] {
  const byId = new Map<string, Record<string, unknown>>();
  if (Array.isArray(saved)) {
    for (const a of saved) {
      if (a && typeof a === 'object' && typeof (a as { id?: unknown }).id === 'string') {
        byId.set((a as { id: string }).id, a as Record<string, unknown>);
      }
    }
  }

  return INITIAL_ACHIEVEMENTS.map(def => {
    const s = byId.get(def.id);
    if (!s) return def;
    const savedProgress = s.progress as { current?: unknown } | undefined;
    const current = num(savedProgress?.current, 0);
    return {
      ...def,
      unlocked: s.unlocked === true,
      unlockedAt: typeof s.unlockedAt === 'string' ? s.unlockedAt : undefined,
      progress: def.progress
        ? { current: Math.min(Math.max(0, current), def.progress.max), max: def.progress.max }
        : undefined
    };
  });
}

function parseSavedProgress(saved: string | null): UserProgress {
  if (!saved) return DEFAULT_PROGRESS;
  try {
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_PROGRESS;

    const xp = Math.max(0, num(parsed.xp, DEFAULT_PROGRESS.xp));
    return {
      xp,
      level: calculateLevel(xp).level,
      streakDays: Math.max(1, num(parsed.streakDays, DEFAULT_PROGRESS.streakDays)),
      lastActiveDate: typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : DEFAULT_PROGRESS.lastActiveDate,
      completedLessonIds: strArr(parsed.completedLessonIds),
      lessonStars: parseLessonStars(parsed.lessonStars),
      completedQuizIds: strArr(parsed.completedQuizIds),
      completedPuzzleIds: strArr(parsed.completedPuzzleIds),
      completedRescueIds: strArr(parsed.completedRescueIds),
      mistakeQuestionIds: strArr(parsed.mistakeQuestionIds),
      achievements: mergeAchievements(parsed.achievements),
      sandboxCommandsCount: Math.max(0, num(parsed.sandboxCommandsCount, 0))
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useGitProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    return parseSavedProgress(safeStorage.get(STORAGE_KEY));
  });

  // Debounced persistence: frequent updates (e.g. every sandbox command) collapse into one
  // JSON.stringify + write. Pending data is flushed when the app is hidden or closed.
  const latestProgressRef = useRef(progress);
  const isDirtyRef = useRef(false);

  const flushProgress = useCallback(() => {
    if (!isDirtyRef.current) return;
    isDirtyRef.current = false;
    safeStorage.set(STORAGE_KEY, JSON.stringify(latestProgressRef.current));
  }, []);

  useEffect(() => {
    latestProgressRef.current = progress;
    isDirtyRef.current = true;
    const timer = setTimeout(flushProgress, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [progress, flushProgress]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushProgress();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', flushProgress);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', flushProgress);
      flushProgress();
    };
  }, [flushProgress]);

  // Update streak safely on initial mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setProgress(prev => {
      if (prev.lastActiveDate === today) return prev;

      const lastDate = new Date(prev.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let newStreak = prev.streakDays;
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }

      return {
        ...prev,
        streakDays: newStreak,
        lastActiveDate: today
      };
    });
  }, []);

  const addXp = useCallback((amount: number) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      const lvlInfo = calculateLevel(newXp);
      const updatedAchievements = checkAchievements(prev, newXp, prev.completedLessonIds, prev.sandboxCommandsCount);
      return {
        ...prev,
        xp: newXp,
        level: lvlInfo.level,
        achievements: updatedAchievements
      };
    });
  }, []);

  const completeQuizQuestion = useCallback((questionId: string, xpReward: number) => {
    setProgress(prev => {
      if (prev.completedQuizIds.includes(questionId)) return prev;

      const newXp = prev.xp + xpReward;
      const lvlInfo = calculateLevel(newXp);
      const updatedAchievements = checkAchievements(
        prev,
        newXp,
        prev.completedLessonIds,
        prev.sandboxCommandsCount
      );

      return {
        ...prev,
        xp: newXp,
        level: lvlInfo.level,
        completedQuizIds: [...prev.completedQuizIds, questionId],
        achievements: updatedAchievements
      };
    });
  }, []);

  const completePuzzle = useCallback((puzzleId: string, xpReward: number) => {
    setProgress(prev => {
      if (prev.completedPuzzleIds.includes(puzzleId)) return prev;

      const newXp = prev.xp + xpReward;
      const lvlInfo = calculateLevel(newXp);
      const updatedAchievements = checkAchievements(
        prev,
        newXp,
        prev.completedLessonIds,
        prev.sandboxCommandsCount
      );

      return {
        ...prev,
        xp: newXp,
        level: lvlInfo.level,
        completedPuzzleIds: [...prev.completedPuzzleIds, puzzleId],
        achievements: updatedAchievements
      };
    });
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setProgress(prev => {
      const achievement = prev.achievements.find(item => item.id === achievementId);
      if (!achievement || achievement.unlocked) return prev;

      return {
        ...prev,
        achievements: prev.achievements.map(item =>
          item.id === achievementId
            ? { ...item, unlocked: true, unlockedAt: 'Только что' }
            : item
        )
      };
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, stars: number, xpReward: number) => {
    setProgress(prev => {
      const alreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = alreadyCompleted ? prev.completedLessonIds : [...prev.completedLessonIds, lessonId];
      const prevStars = prev.lessonStars[lessonId] || 0;
      const bestStars = Math.max(prevStars, stars);
      const gainedXp = alreadyCompleted ? Math.round(xpReward * 0.3) : xpReward;
      const newXp = prev.xp + gainedXp;
      const lvlInfo = calculateLevel(newXp);

      const updatedAchievements = checkAchievements(prev, newXp, newCompleted, prev.sandboxCommandsCount);

      return {
        ...prev,
        xp: newXp,
        level: lvlInfo.level,
        completedLessonIds: newCompleted,
        lessonStars: { ...prev.lessonStars, [lessonId]: bestStars },
        achievements: updatedAchievements
      };
    });
  }, []);

  const recordMistake = useCallback((questionId: string) => {
    setProgress(prev => {
      if (prev.mistakeQuestionIds.includes(questionId)) return prev;
      return {
        ...prev,
        mistakeQuestionIds: [...prev.mistakeQuestionIds, questionId]
      };
    });
  }, []);

  const resolveMistake = useCallback((questionId: string) => {
    setProgress(prev => {
      if (!prev.mistakeQuestionIds.includes(questionId)) return prev;
      return {
        ...prev,
        mistakeQuestionIds: prev.mistakeQuestionIds.filter(id => id !== questionId)
      };
    });
  }, []);

  const incrementSandboxCommands = useCallback(() => {
    setProgress(prev => {
      const newCount = prev.sandboxCommandsCount + 1;
      const updatedAchievements = checkAchievements(prev, prev.xp, prev.completedLessonIds, newCount);
      return {
        ...prev,
        sandboxCommandsCount: newCount,
        achievements: updatedAchievements
      };
    });
  }, []);

  const completeRescue = useCallback((scenarioId: string, xpReward: number) => {
    setProgress(prev => {
      const already = prev.completedRescueIds.includes(scenarioId);
      const newCompleted = already ? prev.completedRescueIds : [...prev.completedRescueIds, scenarioId];
      const newXp = prev.xp + (already ? 20 : xpReward);
      const lvlInfo = calculateLevel(newXp);
      const updatedAchievements = checkAchievements(prev, newXp, prev.completedLessonIds, prev.sandboxCommandsCount, newCompleted);

      return {
        ...prev,
        xp: newXp,
        level: lvlInfo.level,
        completedRescueIds: newCompleted,
        achievements: updatedAchievements
      };
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    const cleanProgress: UserProgress = {
      ...DEFAULT_PROGRESS,
      achievements: INITIAL_ACHIEVEMENTS.map(a => ({
        ...a,
        unlocked: false,
        progress: a.progress ? { current: 0, max: a.progress.max } : undefined
      }))
    };
    setProgress(cleanProgress);
  }, []);

  const levelInfo = useMemo(() => calculateLevel(progress.xp), [progress.xp]);

  return {
    progress,
    levelInfo,
    addXp,
    completeQuizQuestion,
    completePuzzle,
    unlockAchievement,
    completeLesson,
    recordMistake,
    resolveMistake,
    incrementSandboxCommands,
    completeRescue,
    resetAllProgress
  };
}

function checkAchievements(
  prev: UserProgress,
  xp: number,
  completedLessons: string[],
  commandsCount: number,
  completedRescues: string[] = prev.completedRescueIds
): Achievement[] {
  return prev.achievements.map(ach => {
    if (ach.unlocked) return ach;

    if (ach.id === 'ach_first_step' && completedLessons.length >= 1) {
      return { ...ach, unlocked: true, unlockedAt: 'Только что' };
    }

    if (ach.id === 'ach_terminal_hero') {
      const curr = Math.min(10, commandsCount);
      const isUn = curr >= 10;
      return {
        ...ach,
        unlocked: isUn,
        progress: { current: curr, max: 10 },
        unlockedAt: isUn ? 'Только что' : undefined
      };
    }

    if (ach.id === 'ach_branch_master') {
      const branchLessons = ['les_2_1', 'les_2_2', 'les_2_3'];
      const allDone = branchLessons.every(id => completedLessons.includes(id));
      if (allDone) {
        return { ...ach, unlocked: true, unlockedAt: 'Только что' };
      }
    }

    if (ach.id === 'ach_rescue_hero') {
      const curr = Math.min(3, completedRescues.length);
      const isUn = curr >= 3;
      return {
        ...ach,
        unlocked: isUn,
        progress: { current: curr, max: 3 },
        unlockedAt: isUn ? 'Только что' : undefined
      };
    }

    if (
      ach.id === 'ach_git_guru'
      && xp > 500
      && ALL_LESSONS.every(lesson => completedLessons.includes(lesson.id))
    ) {
      return { ...ach, unlocked: true, unlockedAt: 'Только что' };
    }

    return ach;
  });
}

