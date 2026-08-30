import { useState, useEffect, useCallback } from 'react';
import { UserProgress, Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievementsData';

const STORAGE_KEY = 'gitmaster_user_progress_v2';

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

export function useGitProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PROGRESS, ...parsed };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROGRESS;
  });

  const saveProgress = useCallback((newProg: UserProgress) => {
    setProgress(newProg);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProg));
    } catch {
      // ignore
    }
  }, []);

  // Update streak on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastActiveDate !== today) {
      const lastDate = new Date(progress.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let newStreak = progress.streakDays;
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }

      saveProgress({
        ...progress,
        streakDays: newStreak,
        lastActiveDate: today
      });
    }
  }, [progress, saveProgress]);

  const addXp = useCallback((amount: number) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      const lvlInfo = calculateLevel(newXp);
      const updatedAchievements = checkAchievements(prev, newXp, prev.completedLessonIds, prev.sandboxCommandsCount);
      const updated: UserProgress = {
        ...prev,
        xp: newXp,
        level: lvlInfo.level,
        achievements: updatedAchievements
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, stars: number, xpReward: number) => {
    setProgress(prev => {
      const alreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = alreadyCompleted ? prev.completedLessonIds : [...prev.completedLessonIds, lessonId];
      const prevStars = prev.lessonStars[lessonId] || 0;
      const bestStars = Math.max(prevStars, stars);
      const gainedXp = alreadyCompleted ? Math.round(xpReward * 0.3) : xpReward; // 30% XP for repeating lesson
      const newXp = prev.xp + gainedXp;
      const lvlInfo = calculateLevel(newXp);

      const updatedAchievements = checkAchievements(prev, newXp, newCompleted, prev.sandboxCommandsCount);

      const updated: UserProgress = {
        ...prev,
        xp: newXp,
        level: lvlInfo.level,
        completedLessonIds: newCompleted,
        lessonStars: { ...prev.lessonStars, [lessonId]: bestStars },
        achievements: updatedAchievements
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const recordMistake = useCallback((questionId: string) => {
    setProgress(prev => {
      if (prev.mistakeQuestionIds.includes(questionId)) return prev;
      const updated = {
        ...prev,
        mistakeQuestionIds: [...prev.mistakeQuestionIds, questionId]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resolveMistake = useCallback((questionId: string) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        mistakeQuestionIds: prev.mistakeQuestionIds.filter(id => id !== questionId)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const incrementSandboxCommands = useCallback(() => {
    setProgress(prev => {
      const newCount = prev.sandboxCommandsCount + 1;
      const updatedAchievements = checkAchievements(prev, prev.xp, prev.completedLessonIds, newCount);
      const updated = {
        ...prev,
        sandboxCommandsCount: newCount,
        achievements: updatedAchievements
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeRescue = useCallback((scenarioId: string, xpReward: number) => {
    setProgress(prev => {
      const already = prev.completedRescueIds.includes(scenarioId);
      const newCompleted = already ? prev.completedRescueIds : [...prev.completedRescueIds, scenarioId];
      const newXp = prev.xp + (already ? 20 : xpReward);
      const lvlInfo = calculateLevel(newXp);
      const updatedAchievements = checkAchievements(prev, newXp, prev.completedLessonIds, prev.sandboxCommandsCount, newCompleted);

      const updated = {
        ...prev,
        xp: newXp,
        level: lvlInfo.level,
        completedRescueIds: newCompleted,
        achievements: updatedAchievements
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    const cleanProgress: UserProgress = {
      ...DEFAULT_PROGRESS,
      achievements: INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false, progress: a.progress ? { current: 0, max: a.progress.max } : undefined }))
    };
    setProgress(cleanProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanProgress));
  }, []);

  return {
    progress,
    levelInfo: calculateLevel(progress.xp),
    addXp,
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

    if (ach.id === 'ach_git_guru' && xp >= 500 && completedLessons.length >= 10) {
      return { ...ach, unlocked: true, unlockedAt: 'Только что' };
    }

    return ach;
  });
}
