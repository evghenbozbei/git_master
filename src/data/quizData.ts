import { QuizQuestion, CommandPuzzle, RescueScenario, Flashcard } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'Основы',
    difficulty: 'Новичок',
    question: 'Вы изменили файл index.js и хотите добавить только его в индекс перед коммитом. Какая команда нужна?',
    codeExample: '$ git status\nChanges not staged for commit:\n  modified: index.js\n  modified: styles.css',
    options: [
      'git add index.js',
      'git commit index.js',
      'git save index.js',
      'git push index.js'
    ],
    correctIndex: 0,
    explanation: 'Команда `git add <путь_к_файлу>` добавляет указанный файл в Staging Area.',
    tip: 'Для добавления всех файлов используется git add .'
  },
  {
    id: 'q2',
    category: 'Ветки',
    difficulty: 'Новичок',
    question: 'Как создать новую ветку "bugfix/header" и СРАЗУ переключиться на неё одной командой?',
    options: [
      'git branch bugfix/header',
      'git checkout -b bugfix/header (или git switch -c bugfix/header)',
      'git merge bugfix/header',
      'git new bugfix/header'
    ],
    correctIndex: 1,
    explanation: 'Флаг `-b` у checkout (или `-c` у switch) совмещает создание ветки и переход на неё.',
    tip: 'git branch только создает ветку, но оставляет вас на текущей.'
  },
  {
    id: 'q3',
    category: 'Отмена изменений',
    difficulty: 'Средний',
    question: 'Вы сделали коммит, но забыли добавить один важный файл. Как исправить последний коммит без создания нового?',
    options: [
      'git add . && git commit --amend --no-edit',
      'git delete commit && git commit',
      'git revert HEAD',
      'git reset --hard HEAD'
    ],
    correctIndex: 0,
    explanation: 'Флаг `--amend` дополняет предыдущий коммит новыми проиндексированными файлами или позволяет изменить его сообщение.',
    tip: 'Используйте --amend только для локальных, еще не отправленных на сервер коммитов.'
  },
  {
    id: 'q4',
    category: 'Удаленные репозитории',
    difficulty: 'Средний',
    question: 'Вы хотите скачать свежие коммиты с сервера GitHub, но пока НЕ хотите автоматически сливать их со своим кодом. Какая команда подойдет?',
    options: [
      'git pull',
      'git fetch',
      'git clone',
      'git remote sync'
    ],
    correctIndex: 1,
    explanation: '`git fetch` безопасно скачивает все новые коммиты и ссылки, не трогая вашу рабочую директорию и текущую ветку.',
    tip: 'После fetch вы можете посмотреть diff или выполнить merge вручную.'
  },
  {
    id: 'q5',
    category: 'Отмена изменений',
    difficulty: 'Продвинутый',
    question: 'Вы случайно сделали `git reset --hard` и стерли нужный коммит. Где найти его хэш для спасения?',
    options: [
      'В файле .gitignore',
      'В журнале перемещений HEAD: git reflog',
      'Коммит уничтожен навсегда, восстановить невозможно',
      'В системной корзине Windows/macOS'
    ],
    correctIndex: 1,
    explanation: '`git reflog` — это бортовой самописец Git, хранящий историю всех перемещений HEAD за последние 30-90 дней.',
    tip: 'Найдя хэш в reflog, сделайте git checkout <хэш> или git reset --hard <хэш>.'
  },
  {
    id: 'q6',
    category: 'Ветвление и слияние',
    difficulty: 'Средний',
    question: 'Что произойдет, если выполнить `git merge --abort` во время возникшего конфликта слияния?',
    options: [
      'Удалится весь репозиторий',
      'Процесс слияния прервется, а состояние файлов вернется к моменту ДО запуска merge',
      'Все конфликтующие файлы будут перезаписаны версией с сервера',
      'Автоматически выберется чужой код'
    ],
    correctIndex: 1,
    explanation: '`--abort` — это кнопка экстренной отмены слияния при конфликтах.'
  },
  {
    id: 'q7',
    category: 'Продвинутые',
    difficulty: 'Продвинутый',
    question: 'Что делает команда `git cherry-pick 7b3f12a`?',
    options: [
      'Удаляет коммит 7b3f12a из истории',
      'Копирует изменения из коммита 7b3f12a и создает новый коммит в текущей ветке',
      'Сравнивает ветки 7b3f12a и main',
      'Переименовывает ветку'
    ],
    correctIndex: 1,
    explanation: 'Cherry-pick точечно переносит конкретный выбранный коммит в текущую активную ветку.'
  }
];

export const COMMAND_PUZZLES: CommandPuzzle[] = [
  {
    id: 'puz1',
    title: 'Подготовка и первый коммит',
    task: 'Соберите команду для добавления всех измененных файлов в индекс:',
    context: 'Вы изменили 5 файлов в проекте и хотите подготовить их к коммиту.',
    expectedCommand: 'git add .',
    tokens: ['git', 'add', '.', 'commit', 'all', 'push'],
    explanation: '`git add .` индексирует все изменения в текущей директории.'
  },
  {
    id: 'puz2',
    title: 'Создание ветки с фичей',
    task: 'Соберите команду для создания ветки feature/cart и мгновенного перехода в неё:',
    context: 'Начинаем разработку функционала корзины интернет-магазина.',
    expectedCommand: 'git checkout -b feature/cart',
    tokens: ['git', 'checkout', '-b', 'feature/cart', 'branch', 'switch', 'new'],
    explanation: '`git checkout -b <name>` создает ветку и переключает указатель HEAD на неё.'
  },
  {
    id: 'puz3',
    title: 'Спрятать изменения в Stash с комментарием',
    task: 'Соберите команду для сохранения текущей незавершенной работы с сообщением "wip login":',
    context: 'Срочно нужно переключить ветку, не делая коммит.',
    expectedCommand: 'git stash push -m "wip login"',
    tokens: ['git', 'stash', 'push', '-m', '"wip login"', 'save', 'pop'],
    explanation: '`git stash push -m "сообщение"` сохраняет текущие правки с понятным описанием.'
  },
  {
    id: 'puz4',
    title: 'Мягкий откат коммита',
    task: 'Соберите команду для мягкого отката последнего коммита (файлы должны остаться в Staging Area):',
    context: 'Вы случайно закоммитили не то сообщение и хотите перекоммитить.',
    expectedCommand: 'git reset --soft HEAD~1',
    tokens: ['git', 'reset', '--soft', 'HEAD~1', '--hard', 'revert', 'HEAD'],
    explanation: '`git reset --soft HEAD~1` отменяет последний коммит, оставляя файлы проиндексированными.'
  },
  {
    id: 'puz5',
    title: 'Отправка ветки с привязкой к remote',
    task: 'Соберите команду первой отправки ветки dev на GitHub с установкой upstream:',
    context: 'Новая ветка dev еще не существует на удаленном сервере origin.',
    expectedCommand: 'git push -u origin dev',
    tokens: ['git', 'push', '-u', 'origin', 'dev', 'pull', 'master', '--force'],
    explanation: 'Флаг `-u` (или `--set-upstream`) связывает локальную ветку dev с удаленной origin/dev.'
  }
];

export const RESCUE_SCENARIOS: RescueScenario[] = [
  {
    id: 'sc1',
    title: 'Случайный коммит прямо в ветку main!',
    emergencyLevel: 'high',
    story: 'Вы заработались и написали 3 часа нового кода для фичи "Темная тема" прямо в ветке `main` вместо создания отдельной ветки. Вы уже сделали коммит локально, но еще НЕ сделали `git push`.',
    currentGitStateDesc: 'Ветка main содержит коммит "feat: dark theme", который должен был быть в ветке feature/dark-theme.',
    goal: 'Перенести коммит в новую ветку feature/dark-theme, а main вернуть в исходное чистое состояние.',
    options: [
      {
        action: 'Создать новую ветку прямо здесь, а затем на main сделать git reset --hard HEAD~1',
        command: 'git branch feature/dark-theme && git reset --hard HEAD~1',
        isCorrect: true,
        consequence: 'Отличное решение! Ветка `feature/dark-theme` сохранит коммит, а main откатится назад к стабильному состоянию.'
      },
      {
        action: 'Сделать git push в main и надеяться, что никто не заметит',
        command: 'git push origin main',
        isCorrect: false,
        consequence: 'Провал! Вы сломаете сборку в проде и разозлите тимлида.'
      },
      {
        action: 'Удалить папку проекта и скачать заново',
        command: 'rm -rf my-project && git clone ...',
        isCorrect: false,
        consequence: 'Вы потеряли 3 часа написанного кода!'
      }
    ],
    explanation: 'Создание ветки `git branch feature/dark-theme` фиксирует текущий коммит, после чего можно безопасно вернуть `main` на шаг назад через `git reset --hard HEAD~1`.'
  },
  {
    id: 'sc2',
    title: 'В коммит случайно попал секретный пароль / .env',
    emergencyLevel: 'critical',
    story: 'Вы закоммитили файл `.env` с реальным секретным токеном базы данных. Вы вовремя заметили это ДО отправки в GitHub (push не выполнялся).',
    currentGitStateDesc: 'Последний локальный коммит содержит секретный файл .env.',
    goal: 'Убрать .env из коммита, добавить его в .gitignore и пересоздать коммит.',
    options: [
      {
        action: 'Сделать мягкий откат git reset --soft HEAD~1, добавить .env в .gitignore, убрать из индекса и перекоммитить',
        command: 'git reset --soft HEAD~1 && git rm --cached .env && echo .env >> .gitignore && git commit -m "feat: чистый коммит"',
        isCorrect: true,
        consequence: 'Браво! Пароль удален из истории Git до того, как попал в интернет.'
      },
      {
        action: 'Сделать новый коммит со сообщением "delete passwords" и удалить файл',
        command: 'rm .env && git commit -am "delete password"',
        isCorrect: false,
        consequence: 'Ошибка безопасности! В истории предыдущего коммита пароль останется навсегда виден любому, кто клонирует репозиторий.'
      }
    ],
    explanation: 'Если коммит не запушен, `git reset --soft HEAD~1` позволяет безопасно пересобрать его без следов секретов.'
  },
  {
    id: 'sc3',
    title: 'Тимлид просит срочно поправить баг, а у вас недоделанный код',
    emergencyLevel: 'medium',
    story: 'Вы находитесь в ветке `feature/checkout`, код не компилируется и наполовину сломан. Звонит тимлид: срочно переключись на `main` и поправь опечатку в контактах.',
    currentGitStateDesc: 'Множество измененных файлов в рабочей директории, коммитить которые нельзя.',
    goal: 'Сохранить текущее состояние работы, получить чистое дерево для перехода в main, а потом вернуть правки.',
    options: [
      {
        action: 'Спрятать работу в стек через git stash, поправить баг, а потом вернуть через git stash pop',
        command: 'git stash && git checkout main',
        isCorrect: true,
        consequence: 'Идеально! Рабочая директория очищена, вы починили баг на main, вернулись в ветку и сделали `git stash pop`.'
      },
      {
        action: 'Сделать git checkout main с флагом --force',
        command: 'git checkout -f main',
        isCorrect: false,
        consequence: 'Катастрофа! Флаг -f безвозвратно перезапишет и сотрет все ваши незакоммиченные труды.'
      }
    ],
    explanation: '`git stash` специально создан для быстрого переключения контекста.'
  }
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc1',
    category: 'Основы',
    command: 'git add -p',
    flags: '-p (--patch)',
    meaning: 'Интерактивное добавление изменений по кусочкам (chunks/hunks)',
    example: 'Позволяет закоммитить только часть изменений из одного файла, оставив остальные правки на потом.',
    difficulty: 'средний'
  },
  {
    id: 'fc2',
    category: 'Ветки',
    command: 'git branch -vv',
    flags: '-vv (very verbose)',
    meaning: 'Показывает все локальные ветки и их связь с удаленными ветками (tracking branch)',
    example: 'Выводит: main 7b3f12a [origin/main: ahead 1] feat: new design',
    difficulty: 'базовый'
  },
  {
    id: 'fc3',
    category: 'Логи',
    command: 'git log --graph --oneline --all',
    flags: '--graph --oneline --all',
    meaning: 'Красивое ASCII-дерево всех веток и коммитов в терминале',
    example: 'Рисует линии ветвления и слияния символами прямо в консоли.',
    difficulty: 'базовый'
  },
  {
    id: 'fc4',
    category: 'Отмена',
    command: 'git restore --staged <file>',
    flags: '--staged',
    meaning: 'Убрать файл из Staging Area обратно в статус unstaged (аналог git reset HEAD <file>)',
    example: 'git restore --staged secret.txt — файл останется на диске, но не пойдет в коммит.',
    difficulty: 'базовый'
  },
  {
    id: 'fc5',
    category: 'Продвинутые',
    command: 'git clean -fd',
    flags: '-f (force) -d (directories)',
    meaning: 'Удалить все неотслеживаемые (untracked) файлы и новые папки',
    example: 'Очищает проект от временных файлов, которых нет в репозитории.',
    difficulty: 'про'
  },
  {
    id: 'fc6',
    category: 'Продвинутые',
    command: 'git bisect start',
    flags: 'bisect (бинарный поиск)',
    meaning: 'Поиск коммита, сломавшего билд, методом бинарного деления истории',
    example: 'Git автоматически переключает коммиты, пока вы отвечаете "good" или "bad", находя виновника за O(log N) шагов.',
    difficulty: 'про'
  }
];
