import React, { useEffect, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useGitProgress } from './hooks/useGitProgress';
import { Lesson } from './types';
import Navigation, { ActiveScreen } from './components/Navigation';
import MobileFrameWrapper from './components/MobileFrameWrapper';
import RoadmapView from './components/RoadmapView';
import PracticeView from './components/PracticeView';
import TerminalView from './components/TerminalView';
import CheatsheetView from './components/CheatsheetView';
import ProfileView from './components/ProfileView';
import LessonModal from './components/LessonModal';
import SplashScreen from './components/SplashScreen';
import { MODULES, ALL_LESSONS } from './data/lessonsData';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const {
    progress,
    levelInfo,
    completeQuizQuestion,
    completePuzzle,
    unlockAchievement,
    completeLesson,
    recordMistake,
    resolveMistake,
    incrementSandboxCommands,
    completeRescue,
    resetAllProgress
  } = useGitProgress();

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('roadmap');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [terminalInitialCommand, setTerminalInitialCommand] = useState<string>('');
  const navigationStateRef = useRef({ activeScreen, activeLesson, showResetConfirm });

  navigationStateRef.current = { activeScreen, activeLesson, showResetConfirm };

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listenerRemoved = false;
    let removeListener: (() => Promise<void>) | undefined;

    void CapacitorApp.addListener('backButton', () => {
      const currentState = navigationStateRef.current;

      if (currentState.activeLesson) {
        setActiveLesson(null);
        return;
      }

      if (currentState.showResetConfirm) {
        setShowResetConfirm(false);
        return;
      }

      if (currentState.activeScreen !== 'roadmap') {
        setActiveScreen('roadmap');
        return;
      }

      void CapacitorApp.minimizeApp();
    }).then(handle => {
      if (listenerRemoved) {
        void handle.remove();
      } else {
        removeListener = () => handle.remove();
      }
    });

    return () => {
      listenerRemoved = true;
      void removeListener?.();
    };
  }, []);

  const handleLessonComplete = (lessonId: string, stars: number, xpReward: number) => {
    completeLesson(lessonId, stars, xpReward);
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const currIdx = ALL_LESSONS.findIndex(l => l.id === activeLesson.id);
    if (currIdx !== -1 && currIdx + 1 < ALL_LESSONS.length) {
      setActiveLesson(ALL_LESSONS[currIdx + 1]);
    } else {
      setActiveLesson(null);
    }
  };

  const handleTestInTerminal = (cmd: string) => {
    setTerminalInitialCommand(cmd);
    setActiveScreen('terminal');
  };

  return (
    <MobileFrameWrapper>
      <div className="relative flex flex-col min-h-full bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Splash Screen Overlay on startup */}
        <AnimatePresence>
          {showSplash && (
            <SplashScreen onFinish={() => setShowSplash(false)} durationMs={2200} />
          )}
        </AnimatePresence>

        {/* Top Header */}
        <Navigation
          activeScreen={activeScreen}
          onChangeScreen={setActiveScreen}
          progress={progress}
          levelInfo={levelInfo}
        />

        {/* Main Body with Screen Transitions */}
        <main className="flex-1 p-3 sm:p-4">
          <AnimatePresence mode="wait">
            {activeScreen === 'roadmap' && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <RoadmapView
                  progress={progress}
                  onSelectLesson={lesson => setActiveLesson(lesson)}
                />
              </motion.div>
            )}

            {activeScreen === 'practice' && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <PracticeView
                  onCompleteQuizQuestion={completeQuizQuestion}
                  onCompletePuzzle={completePuzzle}
                  onUnlockAchievement={unlockAchievement}
                  onMistake={recordMistake}
                  onResolveMistake={resolveMistake}
                  onCompleteRescue={completeRescue}
                  completedQuizIds={progress.completedQuizIds}
                  completedPuzzleIds={progress.completedPuzzleIds}
                  mistakeQuestionIds={progress.mistakeQuestionIds}
                />
              </motion.div>
            )}

            {activeScreen === 'terminal' && (
              <motion.div
                key="terminal"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <TerminalView
                  onCommandRun={incrementSandboxCommands}
                  initialCommand={terminalInitialCommand}
                />
              </motion.div>
            )}

            {activeScreen === 'cheatsheet' && (
              <motion.div
                key="cheatsheet"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <CheatsheetView onTestInTerminal={handleTestInTerminal} />
              </motion.div>
            )}

            {activeScreen === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ProfileView
                  progress={progress}
                  levelInfo={levelInfo}
                  onReplayLesson={lesson => setActiveLesson(lesson)}
                  onResetProgress={resetAllProgress}
                  showResetConfirm={showResetConfirm}
                  onShowResetConfirmChange={setShowResetConfirm}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Interactive Lesson Modal */}
        <AnimatePresence>
          {activeLesson && (
            <LessonModal
              key={activeLesson.id}
              lesson={activeLesson}
              onClose={() => setActiveLesson(null)}
              onComplete={handleLessonComplete}
              onNextLesson={handleNextLesson}
              isAlreadyCompleted={progress.completedLessonIds.includes(activeLesson.id)}
            />
          )}
        </AnimatePresence>
      </div>
    </MobileFrameWrapper>
  );
}
