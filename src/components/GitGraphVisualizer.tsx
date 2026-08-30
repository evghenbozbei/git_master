import { useMemo } from 'react';
import { GitState } from '../types';
import { motion } from 'motion/react';
import { GitCommit as GitCommitIcon, Tag, Compass } from 'lucide-react';

interface GitGraphVisualizerProps {
  gitState: GitState;
  onSelectCommit?: (commitId: string) => void;
  selectedCommitId?: string | null;
}

export default function GitGraphVisualizer({
  gitState,
  onSelectCommit,
  selectedCommitId
}: GitGraphVisualizerProps) {
  // Layout nodes algorithm for linear/branching commit graph
  const { nodes, links, width, height } = useMemo(() => {
    const commits = gitState.commits;
    const branches = gitState.branches;

    // Assign branch vertical lanes (y)
    const branchLanes: Record<string, number> = {};
    let laneCount = 0;
    branches.forEach(b => {
      if (branchLanes[b.name] === undefined) {
        branchLanes[b.name] = laneCount++;
      }
    });

    const commitMap = new Map<string, { x: number; y: number; commit: typeof commits[0]; branch: string }>();

    // Spacing
    const nodeSpacingX = 64;
    const laneSpacingY = 48;
    const startX = 40;
    const startY = 45;

    commits.forEach((c, idx) => {
      const lane = branchLanes[c.branch] ?? 0;
      const x = startX + idx * nodeSpacingX;
      const y = startY + lane * laneSpacingY;
      commitMap.set(c.id, { x, y, commit: c, branch: c.branch });
    });

    const linksList: { id: string; x1: number; y1: number; x2: number; y2: number; color: string; isMerge?: boolean }[] = [];

    commits.forEach(c => {
      const current = commitMap.get(c.id);
      if (!current) return;

      if (c.parentId) {
        const parent = commitMap.get(c.parentId);
        if (parent) {
          linksList.push({
            id: `${c.parentId}->${c.id}`,
            x1: parent.x,
            y1: parent.y,
            x2: current.x,
            y2: current.y,
            color: current.commit.color
          });
        }
      }

      if (c.parent2Id) {
        const parent2 = commitMap.get(c.parent2Id);
        if (parent2) {
          linksList.push({
            id: `${c.parent2Id}->${c.id}_merge`,
            x1: parent2.x,
            y1: parent2.y,
            x2: current.x,
            y2: current.y,
            color: '#ec4899',
            isMerge: true
          });
        }
      }
    });

    const calculatedWidth = Math.max(340, startX + commits.length * nodeSpacingX + 60);
    const calculatedHeight = Math.max(130, startY + (laneCount + 1) * laneSpacingY);

    return {
      nodes: Array.from(commitMap.values()),
      links: linksList,
      width: calculatedWidth,
      height: calculatedHeight
    };
  }, [gitState]);

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-3 overflow-hidden shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Интерактивный Git-Граф
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
            HEAD: <strong className="text-emerald-400 font-mono">{gitState.activeBranch}</strong>
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto pb-2 scrollbar-thin">
        <svg
          width={width}
          height={height}
          className="min-w-full block"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Links / Branch lines */}
          {links.map(link => {
            const isCurved = link.y1 !== link.y2;
            const pathData = isCurved
              ? `M ${link.x1} ${link.y1} C ${(link.x1 + link.x2) / 2} ${link.y1}, ${(link.x1 + link.x2) / 2} ${link.y2}, ${link.x2} ${link.y2}`
              : `M ${link.x1} ${link.y1} L ${link.x2} ${link.y2}`;

            return (
              <motion.path
                key={link.id}
                d={pathData}
                fill="none"
                stroke={link.color}
                strokeWidth={link.isMerge ? 3 : 2.5}
                strokeDasharray={link.isMerge ? '4 2' : 'none'}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.85 }}
                transition={{ duration: 0.4 }}
              />
            );
          })}

          {/* Commit Nodes */}
          {nodes.map(({ x, y, commit }) => {
            const isHead = commit.id === gitState.headCommitId;
            const isSelected = commit.id === selectedCommitId;
            const branchesOnCommit = gitState.branches.filter(b => b.commitId === commit.id);
            const tagsOnCommit = gitState.tags.filter(t => t.commitId === commit.id);

            return (
              <g
                key={commit.id}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => onSelectCommit?.(commit.id)}
              >
                {/* HEAD Highlight ring */}
                {isHead && (
                  <circle
                    cx={x}
                    cy={y}
                    r={18}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    className="animate-spin"
                    style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '8s' }}
                  />
                )}

                {/* Node Outer Ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 13 : 10}
                  fill={commit.color}
                  stroke="#0f172a"
                  strokeWidth={2.5}
                  filter={isHead ? 'url(#glow)' : undefined}
                />

                {/* Inner dot */}
                <circle cx={x} cy={y} r={3.5} fill="#ffffff" />

                {/* Commit Hash Label */}
                <text
                  x={x}
                  y={y + 24}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                >
                  {commit.hash}
                </text>

                {/* Branch / Tag Badges on top of node */}
                {branchesOnCommit.length > 0 && (
                  <g transform={`translate(${x}, ${y - 18})`}>
                    {branchesOnCommit.map((branch, bIdx) => {
                      const isActive = branch.name === gitState.activeBranch;
                      return (
                        <g key={branch.name} transform={`translate(0, ${-bIdx * 16})`}>
                          <rect
                            x={-branch.name.length * 3.5 - 8}
                            y={-12}
                            width={branch.name.length * 7 + 16}
                            height={14}
                            rx={4}
                            fill={isActive ? '#10b981' : '#1e293b'}
                            stroke={isActive ? '#34d399' : '#475569'}
                            strokeWidth={1}
                          />
                          <text
                            x={0}
                            y={-2}
                            textAnchor="middle"
                            fill={isActive ? '#022c22' : '#cbd5e1'}
                            fontSize="9"
                            fontFamily="JetBrains Mono, monospace"
                            fontWeight="bold"
                          >
                            {isActive ? `* ${branch.name}` : branch.name}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* Tags */}
                {tagsOnCommit.map((tag, tIdx) => (
                  <g key={tag.name} transform={`translate(${x + 14}, ${y + 8 + tIdx * 14})`}>
                    <rect
                      x={0}
                      y={-10}
                      width={tag.name.length * 6 + 18}
                      height={13}
                      rx={3}
                      fill="#854d0e"
                      stroke="#eab308"
                      strokeWidth={0.8}
                    />
                    <text
                      x={10}
                      y={-1}
                      fill="#fef08a"
                      fontSize="8.5"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                    >
                      {tag.name}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected commit details strip */}
      {selectedCommitId && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-2 bg-slate-950/80 rounded-xl border border-slate-800 text-xs flex items-start gap-2.5"
        >
          <GitCommitIcon className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            {(() => {
              const c = gitState.commits.find(c => c.id === selectedCommitId);
              if (!c) return null;
              return (
                <div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-amber-400 font-bold">{c.hash}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 font-sans truncate font-medium">{c.message}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>{c.author}</span>
                    <span>•</span>
                    <span className="text-emerald-400">ветка: {c.branch}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </motion.div>
      )}
    </div>
  );
}
