export interface GitCommit {
  id: string;
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  parentId: string | null;
  parent2Id?: string | null; // for merge commits
  branch: string;
  color: string;
  x?: number;
  y?: number;
  files?: { name: string; status: 'added' | 'modified' | 'deleted' }[];
}

export interface GitBranch {
  name: string;
  commitId: string;
  color: string;
  isRemote?: boolean;
}

export interface GitState {
  commits: GitCommit[];
  branches: GitBranch[];
  activeBranch: string;
  headCommitId: string;
  stagingArea: { name: string; status: string }[];
  workingDirectory: { name: string; status: string }[];
  stashList: { id: string; message: string; branch: string; files: string[] }[];
  remoteBranches: GitBranch[];
  tags: { name: string; commitId: string }[];
  commandHistory: string[];
  terminalOutput: { type: 'cmd' | 'output' | 'error' | 'success' | 'info'; text: string; time?: string }[];
}

export interface LessonStep {
  id: number;
  title: string;
  explanation: string;
  codeSnippet?: string;
  visualConcept?: 'working-tree' | 'branches' | 'merge' | 'rebase' | 'remotes' | 'stash' | 'reset';
  interactiveType: 'reading' | 'command_input' | 'quiz_choice' | 'command_order';
  requiredCommand?: string; // e.g. "git init" or regex
  commandHint?: string;
  quizQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  orderTokens?: string[]; // Tokens to assemble e.g. ["git", "commit", "-m", "\"First commit\""]
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  shortDesc: string;
  difficulty: 'Легко' | 'Средне' | 'Сложно' | 'PRO';
  durationMinutes: number;
  xpReward: number;
  iconName: string;
  theory: {
    overview: string;
    keyPoints: string[];
    realWorldExample: {
      situation: string;
      command: string;
      output: string;
      why: string;
    };
    commonMistakes?: string[];
  };
  steps: LessonStep[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  color: string;
  iconName: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  category: string;
  difficulty: 'Новичок' | 'Средний' | 'Продвинутый';
  question: string;
  codeExample?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip?: string;
}

export interface CommandPuzzle {
  id: string;
  title: string;
  task: string;
  context: string;
  expectedCommand: string;
  tokens: string[]; // shuffled chips
  explanation: string;
}

export interface RescueScenario {
  id: string;
  title: string;
  emergencyLevel: 'low' | 'medium' | 'high' | 'critical';
  story: string;
  currentGitStateDesc: string;
  goal: string;
  options: {
    action: string;
    command: string;
    isCorrect: boolean;
    consequence: string;
  }[];
  explanation: string;
}

export interface Flashcard {
  id: string;
  category: string;
  command: string;
  flags: string;
  meaning: string;
  example: string;
  difficulty: 'базовый' | 'средний' | 'про';
}

export interface CheatSheetCommand {
  id: string;
  command: string;
  title: string;
  category: 'Базовые' | 'Ветки и слияние' | 'Удаленные репозитории' | 'Отмена изменений' | 'Инспекция и логи' | 'Продвинутые';
  syntax: string;
  flags: { flag: string; desc: string }[];
  examples: { cmd: string; desc: string }[];
  proTip?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: { current: number; max: number };
  rarity: 'обычная' | 'редкая' | 'эпическая' | 'легендарная';
}

export interface UserProgress {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  lessonStars: Record<string, number>; // lessonId -> 1, 2, or 3 stars
  completedQuizIds: string[];
  completedPuzzleIds: string[];
  completedRescueIds: string[];
  mistakeQuestionIds: string[];
  achievements: Achievement[];
  sandboxCommandsCount: number;
}
