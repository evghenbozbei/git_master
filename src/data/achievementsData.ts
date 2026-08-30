import { Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_step',
    title: 'Первый коммит в жизнь',
    description: 'Пройдите свой первый обучающий урок по Git.',
    iconName: 'Footprints',
    unlocked: false,
    rarity: 'обычная'
  },
  {
    id: 'ach_terminal_hero',
    title: 'Терминальный ниндзя',
    description: 'Выполните 10 команд в интерактивном терминале.',
    iconName: 'Terminal',
    unlocked: false,
    progress: { current: 0, max: 10 },
    rarity: 'обычная'
  },
  {
    id: 'ach_branch_master',
    title: 'Повелитель параллельных веток',
    description: 'Завершите все уроки модуля «Ветвление и слияние».',
    iconName: 'GitBranch',
    unlocked: false,
    rarity: 'редкая'
  },
  {
    id: 'ach_quiz_champ',
    title: 'Без единой ошибки',
    description: 'Пройдите блиц-квиз без единой ошибки.',
    iconName: 'Award',
    unlocked: false,
    rarity: 'редкая'
  },
  {
    id: 'ach_rescue_hero',
    title: 'Спаситель Продакшена',
    description: 'Решите все критические аварийные ситуации разработчика.',
    iconName: 'ShieldAlert',
    unlocked: false,
    progress: { current: 0, max: 3 },
    rarity: 'эпическая'
  },
  {
    id: 'ach_git_guru',
    title: 'Git Архитектор',
    description: 'Завершите все 5 модулей и наберите более 500 XP.',
    iconName: 'Crown',
    unlocked: false,
    rarity: 'легендарная'
  }
];
