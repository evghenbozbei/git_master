import React, { useState } from 'react';
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
import { MODULES } from './data/lessonsData';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const {
    progress,
    levelInfo,
    addXp,
    completeLesson,
    recordMistake,
    resolveMistake,
    incrementSandboxCommands,
    completeRescue,
    resetAllProgress
  } = useGitProgress();

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('roadmap');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [terminalInitialCommand, setTerminalInitialCommand] = useState<string>('');

  const handleLessonComplete = (lessonId: string, stars: number, xpReward: number) => {
    completeLesson(lessonId, stars, xpReward);
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const allLessons = MODULES.flatMap(m => m.lessons);
    const currIdx = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currIdx !== -1 && currIdx + 1 < allLessons.length) {
      setActiveLesson(allLessons[currIdx + 1]);
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
      <div className="flex flex-col min-h-full bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
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
                  onAddXp={addXp}
                  onMistake={recordMistake}
                  onResolveMistake={resolveMistake}
                  onCompleteRescue={completeRescue}
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
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Interactive Lesson Modal */}
        <AnimatePresence>
          {activeLesson && (
            <LessonModal
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
