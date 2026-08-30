import React, { useState } from 'react';
import { CHEATSHEET_COMMANDS } from '../data/cheatsheetData';
import { Search, BookMarked, Copy, Check, Terminal, Sparkles, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface CheatsheetViewProps {
  onTestInTerminal?: (cmd: string) => void;
}

export default function CheatsheetView({ onTestInTerminal }: CheatsheetViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'Все',
    'Базовые',
    'Ветки и слияние',
    'Удаленные репозитории',
    'Отмена изменений',
    'Продвинутые'
  ];

  const filteredCommands = CHEATSHEET_COMMANDS.filter(item => {
    const matchesCategory = selectedCategory === 'Все' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.command.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      item.syntax.toLowerCase().includes(query) ||
      item.flags.some(f => f.flag.toLowerCase().includes(query) || f.desc.toLowerCase().includes(query)) ||
      item.examples.some(e => e.cmd.toLowerCase().includes(query) || e.desc.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Top Header */}
      <div className="px-1">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-cyan-400" />
          Справочник и Шпаргалка Git
        </h2>
        <p className="text-xs text-slate-400">
          Синтаксис, флаги и наглядные примеры для всех основных команд
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Поиск команды, флага или действия (например, checkout, revert, stash)..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Command List */}
      <div className="space-y-3">
        {filteredCommands.length > 0 ? (
          filteredCommands.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 space-y-3 shadow-lg"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 mt-1">
                    {item.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleCopy(item.command, item.id)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors flex items-center gap-1 text-[11px]"
                  title="Скопировать команду"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[10px]">Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Копия</span>
                    </>
                  )}
                </button>
              </div>

              {/* Syntax */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400">
                <span className="text-slate-600">$ </span>
                {item.syntax}
              </div>

              {/* Flags */}
              {item.flags.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Популярные флаги:</span>
                  <div className="space-y-1">
                    {item.flags.map((fl, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-start gap-2 text-xs bg-slate-950/40 p-1.5 rounded-lg border border-slate-800/60"
                      >
                        <span className="font-mono text-amber-400 font-semibold shrink-0">
                          {fl.flag}
                        </span>
                        <span className="text-slate-300 text-[11px]">{fl.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Examples */}
              {item.examples.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Примеры использования:</span>
                  <div className="space-y-1.5">
                    {item.examples.map((ex, eIdx) => (
                      <div
                        key={eIdx}
                        className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1 font-mono text-xs text-cyan-300 truncate">
                          <span className="text-slate-500">$ </span>
                          {ex.cmd}
                          <div className="text-[10px] font-sans text-slate-400 mt-0.5 truncate">
                            {ex.desc}
                          </div>
                        </div>

                        {onTestInTerminal && (
                          <button
                            onClick={() => onTestInTerminal(ex.cmd)}
                            className="shrink-0 p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-[10px] font-medium flex items-center gap-1"
                            title="Вставить в терминал"
                          >
                            <Terminal className="w-3 h-3" />
                            <span>Тест</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ProTip */}
              {item.proTip && (
                <div className="p-2 bg-amber-950/20 border border-amber-900/30 rounded-xl text-[11px] text-amber-300/90 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    <strong>Совет:</strong> {item.proTip}
                  </span>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-xs">
            Ничего не найдено по запросу "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
}
