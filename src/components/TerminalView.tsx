import React, { useState, useRef, useEffect } from 'react';
import { GitState } from '../types';
import { executeGitCommand, INITIAL_GIT_STATE } from '../utils/gitSimulator';
import GitGraphVisualizer from './GitGraphVisualizer';
import { soundFX } from '../utils/soundEffects';
import { Terminal, Send, RotateCcw, HelpCircle, Layers, Folder, Play, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TerminalViewProps {
  onCommandRun?: () => void;
  initialCommand?: string;
}

export default function TerminalView({ onCommandRun, initialCommand }: TerminalViewProps) {
  const [gitState, setGitState] = useState<GitState>(INITIAL_GIT_STATE);
  const [inputValue, setInputValue] = useState(initialCommand || '');
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'terminal' | 'files'>('terminal');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCommand) {
      setInputValue(initialCommand);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [initialCommand]);

  const quickCommands = [
    'git status',
    'git add .',
    'git commit -m "feat: новая функция"',
    'git branch dev',
    'git checkout -b feature/auth',
    'git switch main',
    'git merge dev',
    'git log --oneline',
    'git stash',
    'git stash pop',
    'git reset --soft HEAD~1',
    'git revert HEAD',
    'git tag v1.0',
    'git push',
    'clear'
  ];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gitState.terminalOutput]);

  const handleRunCommand = (cmdToRun?: string) => {
    const command = cmdToRun !== undefined ? cmdToRun : inputValue;
    if (!command.trim()) return;

    const { newState, output } = executeGitCommand(command, gitState);
    if (output.text) {
      newState.terminalOutput.push(output);
    }

    if (output.type === 'error') {
      soundFX.playMistake();
    } else if (output.type === 'success') {
      soundFX.playCorrect();
    } else {
      soundFX.playTap();
    }

    setGitState(newState);
    setInputValue('');
    setHistoryIndex(-1);
    onCommandRun?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (gitState.commandHistory.length > 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < gitState.commandHistory.length) {
          setHistoryIndex(nextIdx);
          setInputValue(gitState.commandHistory[gitState.commandHistory.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputValue(gitState.commandHistory[gitState.commandHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  const handleResetSandbox = () => {
    soundFX.playTap();
    setGitState({
      ...INITIAL_GIT_STATE,
      terminalOutput: [
        { type: 'info', text: 'Репозиторий сброшен к начальному демо-состоянию.' }
      ]
    });
    setSelectedCommitId(null);
  };

  return (
    <div className="flex flex-col gap-3 h-full max-w-full pb-20">
      {/* Top Header info */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Git Песочница
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-1.5 py-0.5 rounded-full border border-blue-500/30">
                v2.4
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Пишите любые команды и наблюдайте за графом</p>
          </div>
        </div>

        <button
          onClick={handleResetSandbox}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30 px-2.5 py-1 rounded-lg transition-colors"
          title="Сбросить репозиторий"
        >
          <RotateCcw className="w-3 h-3" />
          Сброс
        </button>
      </div>

      {/* Interactive Git Graph Visualizer */}
      <GitGraphVisualizer
        gitState={gitState}
        selectedCommitId={selectedCommitId}
        onSelectCommit={id => setSelectedCommitId(id === selectedCommitId ? null : id)}
      />

      {/* Tabs for Terminal vs Working Tree Files */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1">
        <div className="flex gap-1">
          <button
            onClick={() => {
              soundFX.playTap();
              setActiveTab('terminal');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'terminal'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Терминал
          </button>
          <button
            onClick={() => {
              soundFX.playTap();
              setActiveTab('files');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'files'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Зоны Git ({gitState.stagingArea.length + gitState.workingDirectory.length})
          </button>
        </div>

        <button
          onClick={() => handleRunCommand('help')}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <HelpCircle className="w-3 h-3" />
          Справка
        </button>
      </div>

      {/* Main Container */}
      {activeTab === 'terminal' ? (
        <div className="flex flex-col flex-1 bg-slate-950/95 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden min-h-[300px]">
          {/* Terminal Title Bar */}
          <div className="bg-slate-900/90 px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] font-mono text-slate-400 ml-2">bash — gitmaster</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              ({gitState.activeBranch})
            </span>
          </div>

          {/* Terminal Output Area */}
          <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-2 max-h-[260px] scrollbar-thin">
            {gitState.terminalOutput.map((item, idx) => (
              <div key={idx} className="leading-relaxed">
                {item.type === 'cmd' && (
                  <div className="text-slate-400 flex items-center gap-1">
                    <span className="text-emerald-400">➜</span>
                    <span className="text-cyan-400">my-project</span>
                    <span className="text-amber-300 font-bold">({gitState.activeBranch})</span>
                    <span className="text-slate-200 font-semibold">{item.text}</span>
                  </div>
                )}
                {item.type === 'output' && (
                  <pre className="text-slate-300 whitespace-pre-wrap font-mono text-[11.5px] bg-slate-900/40 p-1.5 rounded-lg border border-slate-800/50">
                    {item.text}
                  </pre>
                )}
                {item.type === 'error' && (
                  <div className="text-rose-400 whitespace-pre-wrap bg-rose-950/30 p-1.5 rounded-lg border border-rose-800/40">
                    {item.text}
                  </div>
                )}
                {item.type === 'success' && (
                  <div className="text-emerald-400 whitespace-pre-wrap bg-emerald-950/30 p-1.5 rounded-lg border border-emerald-800/40 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                )}
                {item.type === 'info' && (
                  <div className="text-cyan-300 whitespace-pre-wrap bg-cyan-950/20 p-2 rounded-lg border border-cyan-800/30 text-[11px]">
                    {item.text}
                  </div>
                )}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Input Line */}
          <div className="p-2 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-xs font-bold pl-1">➜</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите git команду (например, git status)..."
              className="flex-1 bg-transparent text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
            />
            <button
              onClick={() => handleRunCommand()}
              disabled={!inputValue.trim()}
              className="p-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:hover:bg-cyan-500 text-slate-950 font-bold rounded-lg transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Working tree & Staging visual inspection */
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 space-y-3">
          {/* Staging Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Staging Area (Индекс для коммита)
              </span>
              <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                {gitState.stagingArea.length} файл(ов)
              </span>
            </div>
            {gitState.stagingArea.length > 0 ? (
              <div className="space-y-1">
                {gitState.stagingArea.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-1.5 bg-emerald-950/30 rounded-lg border border-emerald-800/40 text-xs font-mono text-emerald-300">
                    <span>{f.name}</span>
                    <span className="text-[10px] uppercase font-sans bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-200">готово к коммиту</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-2 bg-slate-950/40 rounded-lg">Индекс пуст. Используйте `git add` для подготовки файлов.</p>
            )}
          </div>

          {/* Working Directory */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5" />
                Рабочая директория (Неотслеживаемые / Измененные)
              </span>
              <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                {gitState.workingDirectory.length} файл(ов)
              </span>
            </div>
            {gitState.workingDirectory.length > 0 ? (
              <div className="space-y-1">
                {gitState.workingDirectory.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-1.5 bg-amber-950/30 rounded-lg border border-amber-800/40 text-xs font-mono text-amber-300">
                    <span>{f.name}</span>
                    <span className="text-[10px] uppercase font-sans bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-200">untracked</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-2 bg-slate-950/40 rounded-lg">Рабочая директория чиста.</p>
            )}
          </div>

          {/* Stashes */}
          {gitState.stashList.length > 0 && (
            <div>
              <span className="text-xs font-bold text-purple-400 block mb-1.5">
                Временный карман (Stash list):
              </span>
              <div className="space-y-1">
                {gitState.stashList.map((s, i) => (
                  <div key={i} className="p-1.5 bg-purple-950/30 rounded-lg border border-purple-800/40 text-xs font-mono text-purple-300">
                    <div>{s.id}: {s.message}</div>
                    <div className="text-[10px] text-purple-400/80 mt-0.5">Файлы: {s.files.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Action Chips for Mobile */}
      <div className="space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 px-1">Быстрый ввод в один клик:</span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {quickCommands.map((cmd, i) => (
            <button
              key={i}
              onClick={() => handleRunCommand(cmd)}
              className="shrink-0 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 active:bg-cyan-500 active:text-slate-950 text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-700/80 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
