import { CheatSheetCommand } from '../types';

export const CHEATSHEET_COMMANDS: CheatSheetCommand[] = [
  {
    id: 'cs_init',
    command: 'git init',
    title: 'Инициализация репозитория',
    category: 'Базовые',
    syntax: 'git init [папка]',
    flags: [
      { flag: '--bare', desc: 'Создать репозиторий без рабочей директории (для серверов)' },
      { flag: '-b <имя>', desc: 'Задать имя начальной ветки (например, main)' }
    ],
    examples: [
      { cmd: 'git init', desc: 'Создать репозиторий в текущей директории' },
      { cmd: 'git init my-app -b main', desc: 'Создать папку my-app с главной веткой main' }
    ],
    proTip: 'Всегда проверяйте наличие папки .git перед повторным запуском.'
  },
  {
    id: 'cs_clone',
    command: 'git clone',
    title: 'Клонирование репозитория',
    category: 'Удаленные репозитории',
    syntax: 'git clone <url> [папка]',
    flags: [
      { flag: '--depth 1', desc: 'Скачать только последний коммит (быстрое мелкое клонирование)' },
      { flag: '-b <ветка>', desc: 'Склонировать конкретную ветку' }
    ],
    examples: [
      { cmd: 'git clone https://github.com/user/repo.git', desc: 'Склонировать проект по HTTPS' },
      { cmd: 'git clone --depth 1 git@github.com:user/repo.git', desc: 'Скачать проект без тяжелой истории' }
    ]
  },
  {
    id: 'cs_status',
    command: 'git status',
    title: 'Проверка состояния файлов',
    category: 'Базовые',
    syntax: 'git status [опции]',
    flags: [
      { flag: '-s, --short', desc: 'Компактный двухбуквенный вывод статуса файлов' },
      { flag: '-b', desc: 'Показывать информацию о ветке даже в коротком режиме' }
    ],
    examples: [
      { cmd: 'git status', desc: 'Полный отчет о состоянии индекса и рабочей папки' },
      { cmd: 'git status -s', desc: 'Быстрый компактный просмотр: M (изменен), A (добавлен), ?? (новый)' }
    ]
  },
  {
    id: 'cs_add',
    command: 'git add',
    title: 'Индексация изменений (Staging)',
    category: 'Базовые',
    syntax: 'git add <путь>',
    flags: [
      { flag: '.', desc: 'Добавить все файлы в текущей папке и подпапках' },
      { flag: '-A, --all', desc: 'Добавить абсолютно все изменения во всем репозитории' },
      { flag: '-p, --patch', desc: 'Интерактивное добавление по кусочкам' }
    ],
    examples: [
      { cmd: 'git add index.html script.js', desc: 'Добавить конкретные файлы' },
      { cmd: 'git add .', desc: 'Добавить все измененные файлы' },
      { cmd: 'git add -p', desc: 'Пошагово выбрать нужные строчки кода' }
    ]
  },
  {
    id: 'cs_commit',
    command: 'git commit',
    title: 'Фиксация коммита (снапшот)',
    category: 'Базовые',
    syntax: 'git commit [опции]',
    flags: [
      { flag: '-m "сообщение"', desc: 'Указать комментарий к коммиту в командной строке' },
      { flag: '-a', desc: 'Автоматически проиндексировать все отслеживаемые измененные файлы' },
      { flag: '--amend', desc: 'Дополнить или переписать предыдущий коммит' }
    ],
    examples: [
      { cmd: 'git commit -m "feat: добавлен чат поддержки"', desc: 'Создать коммит с понятным текстом' },
      { cmd: 'git commit -am "fix: опечатка в меню"', desc: 'Добавить и закоммитить отслеживаемые файлы за раз' },
      { cmd: 'git commit --amend --no-edit', desc: 'Добавить забытые файлы в прошлый коммит без смены текста' }
    ],
    proTip: 'Придерживайтесь стиля Conventional Commits (feat:, fix:, docs:, refactor:, test:).'
  },
  {
    id: 'cs_branch',
    command: 'git branch',
    title: 'Управление ветками',
    category: 'Ветки и слияние',
    syntax: 'git branch [опции] [имя]',
    flags: [
      { flag: '-a, --all', desc: 'Показать все локальные и удаленные ветки' },
      { flag: '-d <имя>', desc: 'Безопасно удалить ветку (только если она слита)' },
      { flag: '-D <имя>', desc: 'Принудительно удалить ветку' },
      { flag: '-m <старое> <новое>', desc: 'Переименовать ветку' }
    ],
    examples: [
      { cmd: 'git branch', desc: 'Список всех локальных веток' },
      { cmd: 'git branch feature/search', desc: 'Создать ветку feature/search' },
      { cmd: 'git branch -d feature/old', desc: 'Удалить влитую ветку' }
    ]
  },
  {
    id: 'cs_checkout',
    command: 'git checkout / git switch',
    title: 'Переключение веток и версий',
    category: 'Ветки и слияние',
    syntax: 'git checkout <ветка/хэш> / git switch <ветка>',
    flags: [
      { flag: '-b <ветка>', desc: 'Создать ветку и сразу переключиться (checkout)' },
      { flag: '-c <ветка>', desc: 'Создать ветку и сразу переключиться (switch)' }
    ],
    examples: [
      { cmd: 'git switch main', desc: 'Перейти на ветку main' },
      { cmd: 'git checkout -b feature/auth', desc: 'Создать и перейти на ветку feature/auth' }
    ]
  },
  {
    id: 'cs_merge',
    command: 'git merge',
    title: 'Слияние веток',
    category: 'Ветки и слияние',
    syntax: 'git merge <ветка>',
    flags: [
      { flag: '--no-ff', desc: 'Всегда создавать merge commit даже при fast-forward' },
      { flag: '--abort', desc: 'Прервать процесс слияния и вернуть все как было' }
    ],
    examples: [
      { cmd: 'git merge feature/profile', desc: 'Влить feature/profile в текущую ветку' },
      { cmd: 'git merge --abort', desc: 'Отменить слияние при сложном конфликте' }
    ]
  },
  {
    id: 'cs_stash',
    command: 'git stash',
    title: 'Временный карман для черновиков',
    category: 'Отмена изменений',
    syntax: 'git stash [subcommand]',
    flags: [
      { flag: 'pop', desc: 'Применить последние изменения и удалить их из стеша' },
      { flag: 'apply', desc: 'Применить изменения, но оставить запись в стеше' },
      { flag: 'list', desc: 'Показать список всех сохраненных стешей' },
      { flag: '-u', desc: 'Спрятать также новые неотслеживаемые (untracked) файлы' }
    ],
    examples: [
      { cmd: 'git stash', desc: 'Спрятать все правки и очистить рабочую папку' },
      { cmd: 'git stash pop', desc: 'Вернуть спрятанные правки обратно' }
    ]
  },
  {
    id: 'cs_reset',
    command: 'git reset',
    title: 'Откат коммитов',
    category: 'Отмена изменений',
    syntax: 'git reset [режим] <коммит>',
    flags: [
      { flag: '--soft', desc: 'Откатить коммит, сохранив файлы в Staging Area' },
      { flag: '--mixed', desc: 'Откатить коммит, сохранив файлы на диске (по умолчанию)' },
      { flag: '--hard', desc: 'Стереть коммит и все изменения безвозвратно' }
    ],
    examples: [
      { cmd: 'git reset --soft HEAD~1', desc: 'Отменить 1 последний коммит, не теряя код' },
      { cmd: 'git reset --hard HEAD~1', desc: 'Удалить последний коммит и все правки начисто' }
    ]
  },
  {
    id: 'cs_revert',
    command: 'git revert',
    title: 'Безопасная отмена в публичной ветке',
    category: 'Отмена изменений',
    syntax: 'git revert <хэш_коммита>',
    flags: [
      { flag: '--no-commit', desc: 'Применить обратные изменения без автоматического коммита' }
    ],
    examples: [
      { cmd: 'git revert a1b2c3d', desc: 'Создать коммит, отменяющий правки коммита a1b2c3d' }
    ]
  },
  {
    id: 'cs_rebase',
    command: 'git rebase',
    title: 'Перебазирование (линейная история)',
    category: 'Продвинутые',
    syntax: 'git rebase [опции] <целевая_ветка>',
    flags: [
      { flag: '-i, --interactive', desc: 'Интерактивный режим (объединение коммитов squash, правка)' },
      { flag: '--continue', desc: 'Продолжить rebase после разрешения конфликта' },
      { flag: '--abort', desc: 'Прервать rebase' }
    ],
    examples: [
      { cmd: 'git rebase main', desc: 'Перенести коммиты текущей ветки на верхушку main' },
      { cmd: 'git rebase -i HEAD~3', desc: 'Интерактивно отредактировать 3 последних коммита' }
    ]
  },
  {
    id: 'cs_cherrypick',
    command: 'git cherry-pick',
    title: 'Точечный перенос коммита',
    category: 'Продвинутые',
    syntax: 'git cherry-pick <хэш>',
    flags: [
      { flag: '-n, --no-commit', desc: 'Применить изменения без создания коммита' }
    ],
    examples: [
      { cmd: 'git cherry-pick 7b3f12a', desc: 'Скопировать коммит 7b3f12a в текущую ветку' }
    ]
  }
];
