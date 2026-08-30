import React, { useState } from 'react';
import { QuizQuestion, CommandPuzzle, RescueScenario, Flashcard } from '../types';
import { QUIZ_QUESTIONS, COMMAND_PUZZLES, RESCUE_SCENARIOS, FLASHCARDS } from '../data/quizData';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/soundEffects';
import {
  Zap,
  Puzzle,
  ShieldAlert,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Flame,
  Check,
  X,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PracticeViewProps {
  onAddXp: (amount: number) => void;
  onMistake: (questionId: string) => void;
  onResolveMistake: (questionId: string) => void;
  onCompleteRescue: (scenarioId: string, xp: number) => void;
  mistakeQuestionIds: string[];
}

export default function PracticeView({
  onAddXp,
  onMistake,
  onResolveMistake,
  onCompleteRescue,
  mistakeQuestionIds
}: PracticeViewProps) {
  const [activePracticeTab, setActivePracticeTab] = useState<'quiz' | 'puzzles' | 'rescue' | 'flashcards' | 'mistakes'>('quiz');

  // 1. Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // 2. Puzzle state
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const [puzzleAssembled, setPuzzleAssembled] = useState<string[]>([]);
  const [puzzleStatus, setPuzzleStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 3. Rescue Scenario state
  const [currentRescueIdx, setCurrentRescueIdx] = useState(0);
  const [selectedRescueOption, setSelectedRescueOption] = useState<number | null>(null);
  const [rescueSubmitted, setRescueSubmitted] = useState(false);

  // 4. Flashcard state
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Quiz list (filter for mistakes mode or regular quiz)
  const quizList: QuizQuestion[] = activePracticeTab === 'mistakes'
    ? QUIZ_QUESTIONS.filter(q => mistakeQuestionIds.includes(q.id))
    : QUIZ_QUESTIONS;

  const currentQuiz = quizList[currentQuizIdx];
  const currentPuzzle = COMMAND_PUZZLES[currentPuzzleIdx];
  const currentRescue = RESCUE_SCENARIOS[currentRescueIdx];
  const currentCard = FLASHCARDS[currentCardIdx];

  const handleQuizAnswer = (idx: number) => {
    if (quizSubmitted) return;
    soundFX.playTap();
    setSelectedOption(idx);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || !currentQuiz) return;
    setQuizSubmitted(true);
    const isCorrect = selectedOption === currentQuiz.correctIndex;

    if (isCorrect) {
      soundFX.playCorrect();
      setQuizScore(prev => prev + 1);
      onAddXp(20);
      setTimeout(() => {
        soundFX.playXpGain();
      }, 250);
      if (activePracticeTab === 'mistakes') {
        onResolveMistake(currentQuiz.id);
      }
    } else {
      soundFX.playMistake();
      onMistake(currentQuiz.id);
    }
  };

  const handleNextQuiz = () => {
    soundFX.playTap();
    if (currentQuizIdx + 1 < quizList.length) {
      setCurrentQuizIdx(prev => prev + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
      soundFX.playLessonComplete();
      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch {
        // ignore
      }
    }
  };

  const handleRestartQuiz = () => {
    soundFX.playTap();
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  // Puzzle handlers
  const handleAddPuzzleToken = (tok: string) => {
    soundFX.playTap();
    setPuzzleAssembled(prev => [...prev, tok]);
    setPuzzleStatus('idle');
  };

  const handleRemovePuzzleToken = (idx: number) => {
    soundFX.playTap();
    setPuzzleAssembled(prev => prev.filter((_, i) => i !== idx));
    setPuzzleStatus('idle');
  };

  const handleVerifyPuzzle = () => {
    if (!currentPuzzle) return;
    const assembledStr = puzzleAssembled.join(' ');
    if (assembledStr.trim() === currentPuzzle.expectedCommand.trim()) {
      soundFX.playCorrect();
      setPuzzleStatus('success');
      onAddXp(30);
      setTimeout(() => {
        soundFX.playXpGain();
      }, 300);
    } else {
      soundFX.playMistake();
      setPuzzleStatus('error');
    }
  };

  const handleNextPuzzle = () => {
    soundFX.playTap();
    if (currentPuzzleIdx + 1 < COMMAND_PUZZLES.length) {
      setCurrentPuzzleIdx(prev => prev + 1);
      setPuzzleAssembled([]);
      setPuzzleStatus('idle');
    } else {
      setCurrentPuzzleIdx(0);
      setPuzzleAssembled([]);
      setPuzzleStatus('idle');
    }
  };

  // Rescue scenario handlers
  const handleRescueSubmit = () => {
    if (selectedRescueOption === null || !currentRescue) return;
    setRescueSubmitted(true);
    const chosen = currentRescue.options[selectedRescueOption];
    if (chosen.isCorrect) {
      soundFX.playLessonComplete();
      onCompleteRescue(currentRescue.id, 50);
      setTimeout(() => {
        soundFX.playXpGain();
      }, 400);
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {
        // ignore
      }
    } else {
      soundFX.playMistake();
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Header */}
      <div className="px-1">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Тренажёр и Закрепление
        </h2>
        <p className="text-xs text-slate-400">
          Интерактивные квизы, кейсы и конструктор команд для закрепления материала
        </p>
      </div>

      {/* Sub-modes Navigation bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => {
            setActivePracticeTab('quiz');
            handleRestartQuiz();
          }}
          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activePracticeTab === 'quiz'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Блиц-Квиз
        </button>

        <button
          onClick={() => setActivePracticeTab('puzzles')}
          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activePracticeTab === 'puzzles'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Puzzle className="w-3.5 h-3.5" />
          Конструктор
        </button>

        <button
          onClick={() => {
            setActivePracticeTab('rescue');
            setSelectedRescueOption(null);
            setRescueSubmitted(false);
          }}
          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activePracticeTab === 'rescue'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Спаси прод!
        </button>

        <button
          onClick={() => {
            setActivePracticeTab('flashcards');
            setIsCardFlipped(false);
          }}
          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activePracticeTab === 'flashcards'
              ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Флэш-карточки
        </button>

        {mistakeQuestionIds.length > 0 && (
          <button
            onClick={() => {
              setActivePracticeTab('mistakes');
              handleRestartQuiz();
            }}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activePracticeTab === 'mistakes'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-900 text-rose-400 border border-rose-900/40'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Ошибки ({mistakeQuestionIds.length})
          </button>
        )}
      </div>

      {/* 1. BLITZ QUIZ / MISTAKES TAB */}
      {(activePracticeTab === 'quiz' || activePracticeTab === 'mistakes') && (
        <div className="space-y-4">
          {quizList.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/80 rounded-3xl border border-slate-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">Ошибок нет!</h3>
              <p className="text-xs text-slate-400">
                Вы ответили правильно на все вопросы в тренировках.
              </p>
            </div>
          ) : quizFinished ? (
            /* Quiz Completed Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                <Sparkles className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-100">Тест завершен!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ваш результат: <strong className="text-amber-400 font-bold">{quizScore} из {quizList.length}</strong> правильных ответов
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300">
                Заработано: <span className="text-amber-400 font-bold">+{quizScore * 20} XP</span>
              </div>

              <button
                onClick={handleRestartQuiz}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Пройти ещё раз</span>
              </button>
            </motion.div>
          ) : (
            /* Active Quiz Question */
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xl">
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/50">
                  {currentQuiz?.category}
                </span>
                <span className="text-slate-400 font-medium">
                  Вопрос {currentQuizIdx + 1} из {quizList.length}
                </span>
              </div>

              {/* Question text */}
              <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                {currentQuiz?.question}
              </p>

              {/* Optional Code block */}
              {currentQuiz?.codeExample && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 whitespace-pre-wrap">
                  {currentQuiz.codeExample}
                </div>
              )}

              {/* Options */}
              <div className="space-y-2">
                {currentQuiz?.options.map((option, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = optIdx === currentQuiz.correctIndex;
                  let style = 'bg-slate-800/70 border-slate-700 text-slate-200 hover:bg-slate-800';

                  if (quizSubmitted) {
                    if (isCorrect) {
                      style = 'bg-emerald-950/90 border-emerald-500 text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-950/90 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    style = 'bg-amber-950/80 border-amber-400 text-amber-200';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleQuizAnswer(optIdx)}
                      className={`w-full p-3 text-left rounded-xl border text-xs font-medium transition-all flex items-start gap-2.5 ${style}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] shrink-0 font-bold">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-snug">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {quizSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                    selectedOption === currentQuiz?.correctIndex
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                  }`}
                >
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    {selectedOption === currentQuiz?.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Верно! (+20 XP)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Неправильно</span>
                      </>
                    )}
                  </div>
                  <p>{currentQuiz?.explanation}</p>
                  {currentQuiz?.tip && (
                    <p className="mt-1.5 text-slate-400 text-[11px]">
                      💡 <strong>Совет:</strong> {currentQuiz.tip}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Button */}
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={selectedOption === null}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Ответить
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Следующий вопрос</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. COMMAND PUZZLE TAB */}
      {activePracticeTab === 'puzzles' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/50">
              Головоломка {currentPuzzleIdx + 1} из {COMMAND_PUZZLES.length}
            </span>
            <span className="text-xs text-slate-400">+30 XP</span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-100">{currentPuzzle.title}</h3>
            <p className="text-xs text-slate-300 mt-1">{currentPuzzle.task}</p>
            <p className="text-[11px] text-slate-400 italic mt-0.5">Контекст: {currentPuzzle.context}</p>
          </div>

          {/* Assembled Command Zone */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 min-h-[52px] flex flex-wrap items-center gap-1.5 font-mono">
            <span className="text-emerald-400 font-bold mr-1">$</span>
            {puzzleAssembled.length > 0 ? (
              puzzleAssembled.map((tok, i) => (
                <motion.button
                  key={i}
                  layout
                  onClick={() => handleRemovePuzzleToken(i)}
                  className="bg-cyan-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-lg border border-cyan-400 hover:bg-rose-500 hover:text-white transition-colors"
                >
                  {tok}
                </motion.button>
              ))
            ) : (
              <span className="text-xs text-slate-600 italic">Нажимайте фрагменты ниже...</span>
            )}
          </div>

          {/* Available chips */}
          <div className="p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-2 font-medium">Доступные токены:</span>
            <div className="flex flex-wrap gap-2">
              {currentPuzzle.tokens.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddPuzzleToken(tok)}
                  className="bg-slate-800 hover:bg-slate-700 active:bg-cyan-500 active:text-slate-950 text-cyan-300 font-mono text-xs px-3 py-1.5 rounded-xl border border-slate-700 font-semibold transition-all"
                >
                  {tok}
                </button>
              ))}
            </div>
          </div>

          {puzzleStatus === 'error' && (
            <div className="p-2.5 bg-rose-950/40 border border-rose-800/50 rounded-xl text-xs text-rose-300">
              Команда собрана неверно. Попробуйте другой порядок токенов.
            </div>
          )}

          {puzzleStatus === 'success' && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Идеально! (+30 XP)</span>
              </div>
              <p>{currentPuzzle.explanation}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                setPuzzleAssembled([]);
                setPuzzleStatus('idle');
              }}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700"
            >
              Сброс
            </button>
            {puzzleStatus === 'success' ? (
              <button
                onClick={handleNextPuzzle}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span>Следующая головоломка</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleVerifyPuzzle}
                disabled={puzzleAssembled.length === 0}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Проверить
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. RESCUE SCENARIOS ("СПАСИ ПРОД!") */}
      {activePracticeTab === 'rescue' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/50">
              <Flame className="w-3.5 h-3.5" />
              <span>Чрезвычайная ситуация #{currentRescueIdx + 1}</span>
            </div>
            <span className="text-xs text-amber-400 font-bold">+50 XP</span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-100">{currentRescue.title}</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              {currentRescue.story}
            </p>
          </div>

          <div className="p-2.5 bg-amber-950/20 rounded-xl border border-amber-900/30 text-xs text-amber-300">
            <strong>Цель:</strong> {currentRescue.goal}
          </div>

          {/* Action options */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400">Выберите план действий:</span>
            {currentRescue.options.map((opt, oIdx) => {
              const isSelected = selectedRescueOption === oIdx;
              let style = 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800';

              if (rescueSubmitted) {
                if (opt.isCorrect) {
                  style = 'bg-emerald-950 border-emerald-500 text-emerald-200';
                } else if (isSelected && !opt.isCorrect) {
                  style = 'bg-rose-950 border-rose-500 text-rose-200';
                }
              } else if (isSelected) {
                style = 'bg-rose-950/80 border-rose-400 text-rose-200';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => !rescueSubmitted && setSelectedRescueOption(oIdx)}
                  className={`w-full p-3 text-left rounded-2xl border text-xs transition-all space-y-1.5 ${style}`}
                >
                  <div className="font-semibold text-slate-100">{opt.action}</div>
                  <div className="font-mono text-[11px] text-cyan-300 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800/80">
                    $ {opt.command}
                  </div>
                  {rescueSubmitted && isSelected && (
                    <div className="text-[11px] pt-1 text-slate-300">
                      <strong>Последствие:</strong> {opt.consequence}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {!rescueSubmitted ? (
            <button
              onClick={handleRescueSubmit}
              disabled={selectedRescueOption === null}
              className="w-full py-3 bg-rose-500 hover:bg-rose-400 disabled:opacity-30 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Применить решение
            </button>
          ) : (
            <button
              onClick={() => {
                if (currentRescueIdx + 1 < RESCUE_SCENARIOS.length) {
                  setCurrentRescueIdx(prev => prev + 1);
                } else {
                  setCurrentRescueIdx(0);
                }
                setSelectedRescueOption(null);
                setRescueSubmitted(false);
              }}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Следующий сценарий ➜
            </button>
          )}
        </div>
      )}

      {/* 4. FLASHCARDS TAB */}
      {activePracticeTab === 'flashcards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-purple-400 font-bold">
              Карточка {currentCardIdx + 1} из {FLASHCARDS.length}
            </span>
            <span className="text-slate-400 text-[11px]">Нажмите на карточку, чтобы перевернуть</span>
          </div>

          {/* 3D Flip Card */}
          <div
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="cursor-pointer min-h-[220px] bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center shadow-2xl relative transition-all hover:border-purple-500/50"
          >
            <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800/50">
              {currentCard.category} • {currentCard.difficulty}
            </div>

            {!isCardFlipped ? (
              <div className="space-y-3">
                <h3 className="text-xl font-extrabold font-mono text-cyan-300">
                  {currentCard.command}
                </h3>
                <span className="text-xs text-slate-400 block">
                  Флаг: <strong className="text-amber-400 font-mono">{currentCard.flags}</strong>
                </span>
                <span className="text-[11px] text-purple-300 bg-purple-950/40 px-2.5 py-1 rounded-full border border-purple-800/40">
                  Нажмите, чтобы узнать значение
                </span>
              </div>
            ) : (
              <div className="space-y-2 text-left w-full">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Значение:</span>
                <p className="text-xs font-semibold text-slate-100 leading-snug">
                  {currentCard.meaning}
                </p>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block pt-2">Пример использования:</span>
                <p className="text-xs text-slate-300 italic bg-slate-950 p-2 rounded-xl border border-slate-800 font-mono">
                  {currentCard.example}
                </p>
              </div>
            )}
          </div>

          {/* Navigation for Flashcards */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (currentCardIdx > 0) {
                  setCurrentCardIdx(prev => prev - 1);
                  setIsCardFlipped(false);
                }
              }}
              disabled={currentCardIdx === 0}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs rounded-xl border border-slate-700"
            >
              Назад
            </button>
            <button
              onClick={() => {
                if (currentCardIdx + 1 < FLASHCARDS.length) {
                  setCurrentCardIdx(prev => prev + 1);
                } else {
                  setCurrentCardIdx(0);
                }
                setIsCardFlipped(false);
              }}
              className="flex-1 py-3 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Следующая карточка ➜
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
