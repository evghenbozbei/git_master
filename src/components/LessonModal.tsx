import React, { useState } from 'react';
import { Lesson, LessonStep } from '../types';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/soundEffects';
import {
  X,
  Star,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Terminal,
  Code,
  Flame,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete: (lessonId: string, stars: number, xp: number) => void;
  onNextLesson?: () => void;
  isAlreadyCompleted?: boolean;
}

export default function LessonModal({
  lesson,
  onClose,
  onComplete,
  onNextLesson,
  isAlreadyCompleted
}: LessonModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'practice' | 'theory'>('practice');
  const [commandInput, setCommandInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [assembledTokens, setAssembledTokens] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);

  const currentStep: LessonStep | undefined = lesson.steps[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / lesson.steps.length) * 100);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex + 1 < lesson.steps.length) {
      soundFX.playTap();
      setCurrentStepIndex(prev => prev + 1);
      setCommandInput('');
      setInputError(null);
      setSelectedQuizIndex(null);
      setQuizSubmitted(false);
      setAssembledTokens([]);
      setShowHint(false);
    } else {
      // Finished lesson!
      const stars = mistakesCount === 0 ? 3 : mistakesCount <= 2 ? 2 : 1;
      setIsFinished(true);
      triggerConfetti();
      soundFX.playLessonComplete();
      setTimeout(() => {
        soundFX.playXpGain();
      }, 500);
      onComplete(lesson.id, stars, lesson.xpReward);
    }
  };

  const handleVerifyCommand = () => {
    if (!currentStep?.requiredCommand) return;
    const cleanInput = commandInput.trim().toLowerCase().replace(/\s+/g, ' ');
    const cleanRequired = currentStep.requiredCommand.trim().toLowerCase().replace(/\s+/g, ' ');

    // Normalize quotes for commit commands
    const normalizeQuotes = (str: string) => str.replace(/['"`]/g, '"');

    if (normalizeQuotes(cleanInput) === normalizeQuotes(cleanRequired)) {
      soundFX.playCorrect();
      setInputError(null);
      handleNextStep();
    } else {
      soundFX.playMistake();
      setMistakesCount(prev => prev + 1);
      setInputError(`Не совсем так. Требуется: ${currentStep.requiredCommand}`);
    }
  };

  const handleQuizOptionSelect = (index: number) => {
    if (quizSubmitted) return;
    soundFX.playTap();
    setSelectedQuizIndex(index);
  };

  const handleQuizSubmit = () => {
    if (selectedQuizIndex === null || !currentStep?.quizQuestion) return;
    setQuizSubmitted(true);
    if (selectedQuizIndex === currentStep.quizQuestion.correctIndex) {
      soundFX.playCorrect();
      setTimeout(() => {
        handleNextStep();
      }, 1400);
    } else {
      soundFX.playMistake();
      setMistakesCount(prev => prev + 1);
    }
  };

  const handleTokenClick = (token: string, tokenIdx: number) => {
    soundFX.playTap();
    setAssembledTokens(prev => [...prev, token]);
  };

  const handleRemoveToken = (indexToRemove: number) => {
    soundFX.playTap();
    setAssembledTokens(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleVerifyTokens = () => {
    if (!currentStep?.orderTokens) return;
    const assembledStr = assembledTokens.join(' ');
    const targetStr = currentStep.orderTokens.join(' ');

    if (assembledStr === targetStr) {
      soundFX.playCorrect();
      handleNextStep();
    } else {
      soundFX.playMistake();
      setMistakesCount(prev => prev + 1);
      setInputError('Неверный порядок токенов. Попробуйте еще раз.');
    }
  };

  const handleRestartLesson = () => {
    soundFX.playTap();
    setCurrentStepIndex(0);
    setCommandInput('');
    setInputError(null);
    setSelectedQuizIndex(null);
    setQuizSubmitted(false);
    setAssembledTokens([]);
    setShowHint(false);
    setIsFinished(false);
    setMistakesCount(0);
    setActiveTab('practice');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex-1 pr-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/50">
                Урок {lesson.id.replace('les_', '').replace('_', '.')}
              </span>
              <span className="text-xs text-slate-400">+{lesson.xpReward} XP</span>
            </div>
            <h3 className="text-base font-bold text-slate-100 mt-1 line-clamp-1">
              {lesson.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Subnav */}
        {!isFinished && (
          <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">
                Шаг {currentStepIndex + 1} из {lesson.steps.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md transition-colors ${
                    activeTab === 'practice'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Интерактив
                </button>
                <button
                  onClick={() => setActiveTab('theory')}
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                    activeTab === 'theory'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  Теория и примеры
                </button>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 scrollbar-thin">
          <AnimatePresence mode="wait">
            {isFinished ? (
              /* Success Finish Card */
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-4 space-y-4"
              >
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Sparkles className="w-8 h-8 text-slate-950" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-100">
                    Урок успешно пройден!
                  </h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                    Вы освоили тему <strong className="text-slate-200">{lesson.title}</strong>
                  </p>
                </div>

                {/* Star rating */}
                <div className="flex gap-2 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                  {[1, 2, 3].map(starNum => {
                    const starsEarned = mistakesCount === 0 ? 3 : mistakesCount <= 2 ? 2 : 1;
                    const isEarned = starNum <= starsEarned;
                    return (
                      <Star
                        key={starNum}
                        className={`w-7 h-7 ${
                          isEarned
                            ? 'fill-amber-400 text-amber-400 filter drop-shadow'
                            : 'text-slate-700'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Rewards gained */}
                <div className="flex items-center gap-4 bg-slate-800/60 px-4 py-2.5 rounded-xl border border-slate-700/60 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>+{isAlreadyCompleted ? Math.round(lesson.xpReward * 0.3) : lesson.xpReward} XP</span>
                  </div>
                  <div className="h-4 w-px bg-slate-700" />
                  <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Урок закреплен</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full pt-2 flex flex-col gap-2">
                  {onNextLesson && (
                    <button
                      onClick={onNextLesson}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span>Следующий урок</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleRestartLesson}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Повторить урок заново (Закрепить)</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                  >
                    Вернуться к карте уроков
                  </button>
                </div>
              </motion.div>
            ) : activeTab === 'theory' ? (
              /* Theory & Real-world examples Tab */
              <motion.div
                key="theory-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 text-sm"
              >
                <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    Суть концепции
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
                    {lesson.theory.overview}
                  </p>
                </div>

                {/* Key takeaways */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-200 text-xs">Ключевые правила:</h4>
                  {lesson.theory.keyPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-800/40 p-2 rounded-xl border border-slate-800">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {/* Real world situation & command */}
                <div className="p-3.5 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl border border-cyan-900/40 space-y-2">
                  <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Пример из реальной разработки
                  </h4>
                  <p className="text-xs text-slate-300 italic">
                    "{lesson.theory.realWorldExample.situation}"
                  </p>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300">
                    <span className="text-slate-500">$ </span>
                    {lesson.theory.realWorldExample.command}
                  </div>
                  {lesson.theory.realWorldExample.output && (
                    <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                      {lesson.theory.realWorldExample.output}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400">
                    <strong>Зачем:</strong> {lesson.theory.realWorldExample.why}
                  </p>
                </div>

                {/* Common mistakes */}
                {lesson.theory.commonMistakes && lesson.theory.commonMistakes.length > 0 && (
                  <div className="p-3 bg-rose-950/20 rounded-2xl border border-rose-900/30 space-y-1.5">
                    <h4 className="font-bold text-rose-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Чего делать НЕ нужно:
                    </h4>
                    {lesson.theory.commonMistakes.map((m, i) => (
                      <p key={i} className="text-xs text-rose-200/90 leading-snug">
                        • {m}
                      </p>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setActiveTab('practice')}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                >
                  Перейти к интерактивной практике ➜
                </button>
              </motion.div>
            ) : (
              /* Interactive Practice Step */
              <motion.div
                key={`step-${currentStepIndex}`}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4"
              >
                {/* Step Title & Explanation */}
                <div>
                  <h4 className="text-base font-bold text-slate-100">
                    {currentStep?.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-line">
                    {currentStep?.explanation}
                  </p>
                </div>

                {/* Code Snippet Highlight if present */}
                {currentStep?.codeSnippet && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
                    <span>{currentStep.codeSnippet}</span>
                    <Code className="w-4 h-4 text-slate-600" />
                  </div>
                )}

                {/* 1. Step Type: READING */}
                {currentStep?.interactiveType === 'reading' && (
                  <div className="pt-3">
                    <button
                      onClick={handleNextStep}
                      className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      <span>Понятно, дальше</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 2. Step Type: COMMAND_INPUT (Terminal typing simulator) */}
                {currentStep?.interactiveType === 'command_input' && (
                  <div className="space-y-3 pt-1">
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
                      <div className="bg-slate-900/90 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-[11px] font-mono text-slate-400">интерактивный ввод</span>
                        </div>
                        {currentStep.commandHint && (
                          <button
                            onClick={() => setShowHint(!showHint)}
                            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                          >
                            <HelpCircle className="w-3 h-3" />
                            {showHint ? 'Скрыть подсказку' : 'Подсказка'}
                          </button>
                        )}
                      </div>

                      <div className="p-3 font-mono text-xs flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">➜</span>
                        <input
                          type="text"
                          value={commandInput}
                          onChange={e => {
                            setCommandInput(e.target.value);
                            setInputError(null);
                          }}
                          onKeyDown={e => e.key === 'Enter' && handleVerifyCommand()}
                          placeholder="Введите команду..."
                          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck="false"
                          autoFocus
                        />
                      </div>
                    </div>

                    {showHint && currentStep.commandHint && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300 flex items-center gap-2"
                      >
                        <HelpCircle className="w-4 h-4 shrink-0" />
                        <span>{currentStep.commandHint}</span>
                      </motion.div>
                    )}

                    {inputError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2.5 bg-rose-950/40 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{inputError}</span>
                      </motion.div>
                    )}

                    <button
                      onClick={handleVerifyCommand}
                      disabled={!commandInput.trim()}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Выполнить и проверить</span>
                    </button>
                  </div>
                )}

                {/* 3. Step Type: QUIZ_CHOICE */}
                {currentStep?.interactiveType === 'quiz_choice' && currentStep.quizQuestion && (
                  <div className="space-y-3 pt-1">
                    <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                      <p className="text-xs font-semibold text-slate-200">
                        {currentStep.quizQuestion.question}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {currentStep.quizQuestion.options.map((opt, optIdx) => {
                        const isSelected = selectedQuizIndex === optIdx;
                        const isCorrect = optIdx === currentStep.quizQuestion!.correctIndex;
                        let btnStyle = 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800';

                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-cyan-950 border-cyan-400 text-cyan-200';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleQuizOptionSelect(optIdx)}
                            className={`w-full p-3 text-left rounded-xl border text-xs font-medium transition-all flex items-start gap-2.5 ${btnStyle}`}
                          >
                            <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-xl border text-xs ${
                          selectedQuizIndex === currentStep.quizQuestion.correctIndex
                            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                            : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5 mb-1">
                          {selectedQuizIndex === currentStep.quizQuestion.correctIndex ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Верно!</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4" />
                              <span>Ошибка</span>
                            </>
                          )}
                        </div>
                        <p>{currentStep.quizQuestion.explanation}</p>
                      </motion.div>
                    )}

                    {!quizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={selectedQuizIndex === null}
                        className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-slate-950 font-bold text-sm rounded-xl transition-all"
                      >
                        Подтвердить ответ
                      </button>
                    ) : selectedQuizIndex !== currentStep.quizQuestion.correctIndex ? (
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedQuizIndex(null);
                        }}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-colors"
                      >
                        Попробовать ещё раз
                      </button>
                    ) : null}
                  </div>
                )}

                {/* 4. Step Type: COMMAND_ORDER (Token Assembler) */}
                {currentStep?.interactiveType === 'command_order' && currentStep.orderTokens && (
                  <div className="space-y-3 pt-1">
                    {/* Assembled Line */}
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 min-h-[50px] flex flex-wrap items-center gap-1.5 font-mono">
                      <span className="text-emerald-400 font-bold mr-1">$</span>
                      {assembledTokens.length > 0 ? (
                        assembledTokens.map((tok, i) => (
                          <motion.button
                            key={i}
                            layout
                            onClick={() => handleRemoveToken(i)}
                            className="bg-cyan-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-lg border border-cyan-400 hover:bg-rose-500 hover:text-white transition-colors"
                          >
                            {tok}
                          </motion.button>
                        ))
                      ) : (
                        <span className="text-xs text-slate-600 italic">Нажимайте на блоки ниже, чтобы собрать команду...</span>
                      )}
                    </div>

                    {/* Available Tokens to click */}
                    <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block mb-2 font-medium">Доступные фрагменты:</span>
                      <div className="flex flex-wrap gap-2">
                        {currentStep.orderTokens.map((token, tokIdx) => (
                          <button
                            key={tokIdx}
                            onClick={() => handleTokenClick(token, tokIdx)}
                            className="bg-slate-800 hover:bg-slate-700 active:bg-cyan-500 active:text-slate-950 text-cyan-300 font-mono text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition-all font-semibold"
                          >
                            {token}
                          </button>
                        ))}
                      </div>
                    </div>

                    {inputError && (
                      <div className="p-2.5 bg-rose-950/40 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{inputError}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setAssembledTokens([]);
                          setInputError(null);
                        }}
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700"
                      >
                        Очистить
                      </button>
                      <button
                        onClick={handleVerifyTokens}
                        disabled={assembledTokens.length === 0}
                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-slate-950 font-bold text-sm rounded-xl transition-all"
                      >
                        Проверить сборку
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
