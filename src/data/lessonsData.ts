import { Module } from '../types';

export const MODULES: Module[] = [
  {
    id: 'mod_1',
    number: 1,
    title: 'Основы Git и первый коммит',
    description: 'Что такое система контроля версий, 3 состояния файлов, git init, add, commit и log.',
    color: '#3b82f6',
    iconName: 'GitCommit',
    lessons: [
      {
        id: 'les_1_1',
        moduleId: 'mod_1',
        title: 'Что такое Git и инициализация репозитория',
        shortDesc: 'Познакомьтесь с Git и создайте свой первый репозиторий командой git init.',
        difficulty: 'Легко',
        durationMinutes: 4,
        xpReward: 50,
        iconName: 'FolderGit2',
        theory: {
          overview: 'Git — это распределенная система контроля версий (VCS). Она сохраняет снимки (снапшоты) вашего проекта во времени. Это как "чекпоинты" в игре: вы можете в любой момент вернуться назад, если что-то сломалось.',
          keyPoints: [
            'Git работает локально на вашем компьютере даже без интернета.',
            'Команда `git init` создает скрытую папку `.git`, где хранится вся история проекта.',
            'Если удалить папку `.git`, проект перестанет быть репозиторием, но ваши файлы останутся.'
          ],
          realWorldExample: {
            situation: 'Вы создали папку с новым сайтом `my-awesome-app` и хотите начать отслеживать в ней изменения.',
            command: 'git init',
            output: 'Initialized empty Git repository in /projects/my-awesome-app/.git/',
            why: 'Теперь в этой папке инициализирован репозиторий Git, и мы готовы фиксировать изменения.'
          },
          commonMistakes: [
            'Не создавайте репозиторий внутри другого репозитория (вложенный git init).',
            'Не запускайте git init в домашней папке C:\\Users\\User или /home/user.'
          ]
        },
        steps: [
          {
            id: 1,
            title: 'Знакомство с Git',
            explanation: 'Представьте Git как машину времени для кода. Вместо сохранения файлов вида `diplom_final_v2_точно_финал.docx`, Git элегантно сохраняет историю каждой строчки.',
            interactiveType: 'reading'
          },
          {
            id: 2,
            title: 'Инициализируем репозиторий',
            explanation: 'В терминале введите команду для инициализации репозитория в текущей папке.',
            codeSnippet: 'git init',
            interactiveType: 'command_input',
            requiredCommand: 'git init',
            commandHint: 'Напишите: git init'
          },
          {
            id: 3,
            title: 'Проверка понимания',
            explanation: 'Какая папка создается при вызове git init?',
            interactiveType: 'quiz_choice',
            quizQuestion: {
              question: 'Куда Git сохраняет всю историю изменений и служебные данные?',
              options: [
                'В облако GitHub автоматически',
                'В скрытую папку .git в корне проекта',
                'В файл package.json',
                'В реестр операционной системы'
              ],
              correctIndex: 1,
              explanation: 'Именно в скрытой папке `.git` хранится вся база данных объектов, коммитов и веток.'
            }
          }
        ]
      },
      {
        id: 'les_1_2',
        moduleId: 'mod_1',
        title: '3 зоны Git: status и add',
        shortDesc: 'Узнайте про Working Tree, Staging Area и как готовить файлы к коммиту.',
        difficulty: 'Легко',
        durationMinutes: 5,
        xpReward: 60,
        iconName: 'Layers',
        theory: {
          overview: 'В Git существует 3 ключевые зоны:\n1. **Рабочая директория (Working Directory)** — файлы, которые вы редактируете в редакторе кода.\n2. **Индекс / Сцена (Staging Area)** — корзина подготовленных к сохранению изменений.\n3. **Репозиторий (Git Directory / Commit)** — надежно зафиксированный слепок истории.',
          keyPoints: [
            '`git status` — главная команда для проверки: что изменилось и что готово к коммиту.',
            '`git add <файл>` — переносит файл из Рабочей зоны в Staging Area (индекс).',
            '`git add .` или `git add -A` — добавляет ВСЕ измененные файлы в текущей папке в индекс.'
          ],
          realWorldExample: {
            situation: 'Вы изменили `index.html` и добавили `style.css`. Перед тем как зафиксировать изменения, вы проверяете статус и добавляете их.',
            command: 'git add index.html style.css',
            output: 'Changes to be committed: \n  modified: index.html \n  new file: style.css',
            why: 'Staging Area позволяет отобрать именно те файлы, которые относятся к текущей логической задаче.'
          },
          commonMistakes: [
            'Забыть сделать `git add` перед `git commit`.',
            'Случайно добавить `node_modules` или секретные пароли (для этого нужен `.gitignore`).'
          ]
        },
        steps: [
          {
            id: 1,
            title: 'Проверяем статус',
            explanation: 'Команда `git status` — ваш лучший друг. Она показывает измененные и неотслеживаемые (untracked) файлы.',
            codeSnippet: 'git status',
            interactiveType: 'command_input',
            requiredCommand: 'git status',
            commandHint: 'Введите: git status'
          },
          {
            id: 2,
            title: 'Добавляем файлы в индекс',
            explanation: 'Чтобы подготовить файлы к коммиту, отправьте их в Staging Area с помощью команды `git add .`',
            codeSnippet: 'git add .',
            interactiveType: 'command_input',
            requiredCommand: 'git add .',
            commandHint: 'Введите: git add .'
          },
          {
            id: 3,
            title: 'Соберите команду',
            explanation: 'Соберите правильную команду для добавления одного конкретного файла `main.js` в индекс:',
            interactiveType: 'command_order',
            orderTokens: ['git', 'add', 'main.js']
          }
        ]
      },
      {
        id: 'les_1_3',
        moduleId: 'mod_1',
        title: 'Фиксация изменений: git commit',
        shortDesc: 'Создаем первый коммит, пишем понятные сообщения и изучаем хэши.',
        difficulty: 'Легко',
        durationMinutes: 5,
        xpReward: 70,
        iconName: 'CheckCircle2',
        theory: {
          overview: 'Коммит (Commit) — это снимок (снапшот) состояния файлов из Staging Area. У каждого коммита есть уникальный SHA-1 хэш (например, `a1b2c3d`), автор, дата и понятное текстовое сообщение.',
          keyPoints: [
            'Команда `git commit -m "описание"` создает коммит с сообщением в одну строку.',
            'Хорошее сообщение отвечает на вопрос: "Что изменил этот коммит?" (например, `feat: добавить кнопку входа`).',
            'Коммиты должны быть атомарными (одна логическая задача — один коммит).'
          ],
          realWorldExample: {
            situation: 'Вы сверстали форму авторизации и хотите зафиксировать результат.',
            command: 'git commit -m "feat: форма авторизации пользователя"',
            output: '[main a1b2c3d] feat: форма авторизации пользователя\n 2 files changed, 48 insertions(+)',
            why: 'Теперь этот этап работы навсегда сохранен в истории проекта.'
          },
          commonMistakes: [
            'Бесполезные сообщения: "fix", "asdasd", "update", "работает".',
            'Слишком гигантские коммиты размером в месяц работы.'
          ]
        },
        steps: [
          {
            id: 1,
            title: 'Создаем коммит',
            explanation: 'Выполните команду для сохранения коммита с понятным комментарием:',
            codeSnippet: 'git commit -m "feat: первый релиз"',
            interactiveType: 'command_input',
            requiredCommand: 'git commit -m "feat: первый релиз"',
            commandHint: 'Напишите: git commit -m "feat: первый релиз"'
          },
          {
            id: 2,
            title: 'Квиз по коммитам',
            explanation: 'Какое из этих сообщений коммита считается образцовым по стандартам разработки (Conventional Commits)?',
            interactiveType: 'quiz_choice',
            quizQuestion: {
              question: 'Какое сообщение коммита наилучшее?',
              options: [
                'исправил баг',
                'fix: валидация email при регистрации',
                'WIP commit 12345',
                'все готово'
              ],
              correctIndex: 1,
              explanation: 'Префикс типа (`fix:`) и конкретная суть изменения дают коллегам мгновенное понимание сути коммита.'
            }
          }
        ]
      },
      {
        id: 'les_1_4',
        moduleId: 'mod_1',
        title: 'История и игнорирование (.gitignore и log)',
        shortDesc: 'Как просматривать историю проекта и скрывать мусорные файлы с помощью .gitignore.',
        difficulty: 'Легко',
        durationMinutes: 4,
        xpReward: 60,
        iconName: 'FileText',
        theory: {
          overview: 'В проекте всегда есть файлы, которые нельзя отправлять в Git: пароли, `.env`, сборки `dist/`, тяжелые зависимости `node_modules/`. Для этого создается файл `.gitignore`.\nДля просмотра истории коммитов используется `git log`.',
          keyPoints: [
            '`git log --oneline` — компактная история в одну строку на коммит.',
            'В `.gitignore` можно писать маски: `*.log`, `node_modules/`, `.env`.',
            'Файлы, указанные в `.gitignore`, никогда не попадут в `git status` как неиндексированные.'
          ],
          realWorldExample: {
            situation: 'Вы хотите посмотреть последние коммиты в кратком виде.',
            command: 'git log --oneline',
            output: 'e4f5g6h feat: страница профиля\na1b2c3d feat: первый релиз',
            why: 'Компактный лог позволяет быстро найти нужный хэш коммита.'
          }
        },
        steps: [
          {
            id: 1,
            title: 'Смотрим компактный лог',
            explanation: 'Выполните команду для отображения компактной истории коммитов в одну строчку:',
            codeSnippet: 'git log --oneline',
            interactiveType: 'command_input',
            requiredCommand: 'git log --oneline',
            commandHint: 'Введите: git log --oneline'
          },
          {
            id: 2,
            title: 'Зачем нужен .gitignore?',
            explanation: 'Что произойдет, если добавить строчку `.env` в файл `.gitignore`?',
            interactiveType: 'quiz_choice',
            quizQuestion: {
              question: 'Для чего в проекте файл .gitignore?',
              options: [
                'Чтобы удалить файлы с жесткого диска',
                'Чтобы Git игнорировал указанные файлы и не отслеживал их изменения',
                'Чтобы ускорить интернет-соединение с GitHub',
                'Чтобы сжать проект в zip-архив'
              ],
              correctIndex: 1,
              explanation: '.gitignore защищает репозиторий от попадания секретов, логов и тяжелых сгенерированных папок.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mod_2',
    number: 2,
    title: 'Ветвление и слияние (Branches & Merging)',
    description: 'Параллельная разработка фич, указатель HEAD, git branch, checkout, switch и разрешение конфликтов.',
    color: '#10b981',
    iconName: 'GitBranch',
    lessons: [
      {
        id: 'les_2_1',
        moduleId: 'mod_2',
        title: 'Ветки и указатель HEAD: branch и checkout/switch',
        shortDesc: 'Как создавать изолированные ветки для новых фич и переключаться между ними.',
        difficulty: 'Средне',
        durationMinutes: 6,
        xpReward: 80,
        iconName: 'GitFork',
        theory: {
          overview: 'Ветка в Git — это легковесный подвижный указатель на определенный коммит. Ветки позволяют безопасно разрабатывать новые фичи, не ломая стабильную основную ветку `main`.\n`HEAD` — это специальный указатель на то, где вы находитесь прямо сейчас.',
          keyPoints: [
            '`git branch <имя>` — создает новую ветку.',
            '`git checkout <имя>` или современный `git switch <имя>` — переключает вас на ветку.',
            '`git checkout -b <имя>` или `git switch -c <имя>` — создает ветку и сразу переходит на неё.'
          ],
          realWorldExample: {
            situation: 'Нужно сделать темную тему для сайта, не трогая рабочий код.',
            command: 'git checkout -b feature/dark-theme',
            output: 'Switched to a new branch \'feature/dark-theme\'',
            why: 'Все новые коммиты теперь будут изолированы в ветке dark-theme.'
          }
        },
        steps: [
          {
            id: 1,
            title: 'Создаем и переключаемся на ветку',
            explanation: 'Создайте новую ветку `feature/login` одной командой с флагом `-b`:',
            codeSnippet: 'git checkout -b feature/login',
            interactiveType: 'command_input',
            requiredCommand: 'git checkout -b feature/login',
            commandHint: 'Введите: git checkout -b feature/login'
          },
          {
            id: 2,
            title: 'Указатель HEAD',
            explanation: 'Что означает указатель HEAD в Git?',
            interactiveType: 'quiz_choice',
            quizQuestion: {
              question: 'На что указывает HEAD?',
              options: [
                'На самый первый коммит в проекте',
                'На текущую активную ветку или коммит, на котором вы находитесь',
                'На удаленный сервер GitHub',
                'На последний удаленный коммит'
              ],
              correctIndex: 1,
              explanation: 'HEAD — это ваш текущий маркер положения в графе коммитов.'
            }
          }
        ]
      },
      {
        id: 'les_2_2',
        moduleId: 'mod_2',
        title: 'Слияние веток: git merge',
        shortDesc: 'Объединяем готовую ветку с фичей обратно в главную ветку main.',
        difficulty: 'Средне',
        durationMinutes: 6,
        xpReward: 85,
        iconName: 'GitMerge',
        theory: {
          overview: 'Когда разработка функционала в отдельной ветке завершена, её нужно слить (merge) в основную ветку `main`.\nСуществует два основных типа слияния:\n1. **Fast-forward** — если в main не было новых коммитов, указатель просто перемещается вперед.\n2. **3-way Merge Commit** — если обе ветки ушли вперед, Git создает специальный коммит слияния с двумя родителями.',
          keyPoints: [
            'Перед слиянием всегда переключитесь на ветку, КУДА вливаете (например, `git checkout main`).',
            'Затем выполните `git merge <имя_ветки_источника>`.',
            'После успешного слияния ветку фичи можно удалить командой `git branch -d <имя>`.'
          ],
          realWorldExample: {
            situation: 'Фича `feature/login` готова. Вы находитесь на `main` и хотите влить её.',
            command: 'git merge feature/login',
            output: 'Merge made by the \'ort\' strategy. \n login.js | 35 +++++++\n 1 file changed, 35 insertions(+)',
            why: 'Код фичи стал частью стабильной версии в main.'
          }
        },
        steps: [
          {
            id: 1,
            title: 'Слияние ветки',
            explanation: 'Вы находитесь на ветке `main`. Выполните слияние ветки `feature/login` в текущую ветку:',
            codeSnippet: 'git merge feature/login',
            interactiveType: 'command_input',
            requiredCommand: 'git merge feature/login',
            commandHint: 'Введите: git merge feature/login'
          },
          {
            id: 2,
            title: 'Соберите команду удаления ветки',
            explanation: 'Ветка фичи успешно влита. Соберите команду для безопасного удаления ветки `feature/login`:',
            interactiveType: 'command_order',
            orderTokens: ['git', 'branch', '-d', 'feature/login']
          }
        ]
      },
      {
        id: 'les_2_3',
        moduleId: 'mod_2',
        title: 'Конфликты слияния: как их решать без паники',
        shortDesc: 'Что делать, когда два разработчика изменили одну и ту же строчку кода.',
        difficulty: 'Сложно',
        durationMinutes: 7,
        xpReward: 95,
        iconName: 'AlertTriangle',
        theory: {
          overview: 'Конфликт слияния (Merge Conflict) возникает, когда в двух ветках изменена одна и та же строка одного файла. Git не может угадать, какая версия правильная, и просит разработчика сделать выбор вручную.',
          keyPoints: [
            'Git помечает конфликт маркерами: `<<<<<<< HEAD` (ваша версия), `=======` (разделитель), `>>>>>>> branch-name` (чужая версия).',
            'Решение конфликта: открыть файл, выбрать нужный код, стереть маркеры конфликта, сделать `git add <файл>` и `git commit`.',
            'Если вы испугались и хотите отменить процесс слияния: `git merge --abort`.'
          ],
          realWorldExample: {
            situation: 'При слиянии вы видите сообщение `CONFLICT (content): Merge conflict in index.html`.',
            command: 'git status',
            output: 'You have unmerged paths. (fix conflicts and run "git commit")\n  both modified: index.html',
            why: 'Нужно вручную отредактировать `index.html` и закоммитить результат.'
          }
        },
        steps: [
          {
            id: 1,
            title: 'Анатомия конфликта',
            explanation: 'Внутри файла вы увидите:\n```\n<<<<<<< HEAD\n<button class="blue-btn">Купить</button>\n=======\n<button class="green-btn">Оформить заказ</button>\n>>>>>>> feature/cart\n```\nВы удаляете лишний вариант и разделители, оставляя финальный код.',
            interactiveType: 'reading'
          },
          {
            id: 2,
            title: 'Как отменить слияние при конфликте?',
            explanation: 'Какая команда вернет состояние репозитория к моменту до попытки слияния?',
            interactiveType: 'quiz_choice',
            quizQuestion: {
              question: 'Как полностью прервать процесс слияния при возникновении конфликта?',
              options: [
                'git merge --abort',
                'git delete conflict',
                'git cancel',
                'git stop'
              ],
              correctIndex: 0,
              explanation: '`git merge --abort` моментально возвращает состояние веток назад.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mod_3',
    number: 3,
    title: 'Удаленные репозитории (GitHub & Teamwork)',
    description: 'Связь с удаленными серверами, git remote, clone, push, fetch и pull.',
    color: '#8b5cf6',
    iconName: 'Cloud',
    lessons: [
      {
        id: 'les_3_1',
        moduleId: 'mod_3',
        title: 'Связь с сервером: remote и clone',
        shortDesc: 'Как подключить локальный Git к GitHub/GitLab или склонировать чужой проект.',
        difficulty: 'Легко',
        durationMinutes: 5,
        xpReward: 70,
        iconName: 'Globe',
        theory: {
          overview: 'Удаленный репозиторий (Remote) — это версия вашего проекта, хранящаяся на сервере (GitHub, GitLab, Bitbucket). По общепринятой традиции основной удаленный сервер называют `origin`.',
          keyPoints: [
            '`git clone <URL>` — скачивает удаленный репозиторий со всей историей на ваш компьютер.',
            '`git remote add origin <URL>` — связывает существующий локальный репозиторий с удаленным.',
            '`git remote -v` — показывает список настроенных удаленных серверов.'
          ],
          realWorldExample: {
            situation: 'Вы создали репозиторий на GitHub и связываете его с локальной папкой.',
            command: 'git remote add origin https://github.com/user/my-app.git',
            output: '',
            why: 'Теперь Git знает адрес сервера под псевдонимом origin.'
          }
        },
        steps: [
          {
            id: 1,
            title: 'Клонирование проекта',
            explanation: 'Соберите команду для клонирования проекта по URL:',
            interactiveType: 'command_order',
            orderTokens: ['git', 'clone', 'https://github.com/example/repo.git']
          },
          {
            id: 2,
            title: 'Показываем список серверов',
            explanation: 'Какая команда выведет список всех подключенных удаленных репозиториев с их URL?',
            interactiveType: 'quiz_choice',
            quizQuestion: {
              question: 'Команда для просмотра настроенных remote URL:',
              options: [
                'git remote -v',
                'git url show',
                'git github list',
                'git server info'
              ],
              correctIndex: 0,
              explanation: 'Флаг `-v` (verbose) показывает точные адреса для fetch и push.'
            }
          }
        ]
      },
      {
        id: 'les_3_2',
        moduleId: 'mod_3',
        title: 'Обмен кодом: push, fetch и pull',
        shortDesc: 'Разница между fetch и pull, отправка коммитов в облако.',
        difficulty: 'Средне',
        durationMinutes: 6,
        xpReward: 80,
        iconName: 'ArrowUpDown',
        theory: {
          overview: 'Для обмена коммитами с командой:\n1. **`git push`** — отправляет ваши новые локальные коммиты на сервер.\n2. **`git fetch`** — безопасно скачивает новые коммиты с сервера, НЕ меняя ваши локальные файлы.\n3. **`git pull`** — это комбинация `git fetch` + `git merge` (скачивает и сразу сливает в вашу текущую ветку).',
          keyPoints: [
            'При первой отправке ветки используют `git push -u origin main` (флаг -u запоминает связь).',
            '`git pull` может привести к конфликту, если на сервере и у вас разные коммиты.',
            'Перед началом рабочего дня всегда делайте `git pull`, чтобы работать со свежим кодом.'
          ],
          realWorldExample: {
            situation: 'Вы сделали 2 коммита и хотите отправить их коллегам на GitHub.',
            command: 'git push',
            output: 'To https://github.com/user/my-app.git\n   a1b2c3d..e4f5g6h  main -> main',
            why: 'Команда увидит ваши изменения.'
          }
        },
        steps: [
          {
            id: 1,
            title: 'Отправляем коммиты',
            explanation: 'Выполните команду отправки локальных изменений на удаленный репозиторий:',
            codeSnippet: 'git push',
            interactiveType: 'command_input',
            requiredCommand: 'git push',
            commandHint: 'Введите: git push'
          },
          {
            id: 2,
            title: 'В чем разница между fetch и pull?',
            explanation: 'Выберите точное описание различия между fetch и pull:',
            interactiveType: 'quiz_choice',
            quizQuestion: {
              question: 'Чем git fetch отличается от git pull?',
              options: [
                'fetch только скачивает данные без слияния, а pull скачивает и сразу сливает в текущую ветку',
                'fetch удаляет ветку, а pull создает новую',
                'Ничем, это синонимы',
                'pull отправляет код на сервер, а fetch скачивает'
              ],
              correctIndex: 0,
              explanation: '`git pull = git fetch + git merge`. Поэтому `fetch` более безопасен для инспекции.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mod_4',
    number: 4,
    title: 'Отмена изменений и исправление ошибок',
    description: 'Как спрятать черновики в stash, отменить коммиты через reset и revert, и спасти удаленное через reflog.',
    color: '#f59e0b',
    iconName: 'RotateCcw',
    lessons: [
      {
        id: 'les_4_1',
        moduleId: 'mod_4',
        title: 'Временный карман: git stash',
        shortDesc: 'Как быстро сохранить незавершенный черновик без создания мусорного коммита.',
        difficulty: 'Средне',
        durationMinutes: 5,
        xpReward: 75,
        iconName: 'Archive',
        theory: {
          overview: 'Бывает ситуация: вы пишите сложную фичу, код наполовину сломан, и тут тимлид просит: "Срочно переключись на main и поправь критический баг!". Коммитить сломанный код нельзя, а переключить ветку Git не дает.\nРешение — `git stash` (спрятать в карман).',
          keyPoints: [
            '`git stash` — убирает все локальные изменения в специальный стек и делает рабочую папку чистой.',
            '`git stash pop` — достает последние сохраненные изменения обратно и удаляет их из стека.',
            '`git stash list` — показывает список всех спрятанных правок.'
          ],
          realWorldExample: {
            situation: 'Нужно быстро переключить ветку, не коммитя черновик.',
            command: 'git stash',
            output: 'Saved working directory and index state WIP on feature: a1b2c3d',
            why: 'Рабочая папка снова чистая, можно делать checkout.'
          }
        },
        steps: [
          {
            id: 1,
            title: 'Прячем изменения в Stash',
            explanation: 'Выполните команду для сохранения текущих правок в стек stash:',
            codeSnippet: 'git stash',
            interactiveType: 'command_input',
            requiredCommand: 'git stash',
            commandHint: 'Введите: git stash'
          },
          {
            id: 2,
            title: 'Восстанавливаем из Stash',
            explanation: 'Вы вернулись к своей фиче. Соберите команду для извлечения изменений из стеша:',
            interactiveType: 'command_order',
            orderTokens: ['git', 'stash', 'pop']
          }
        ]
      },
      {
        id: 'les_4_2',
        moduleId: 'mod_4',
        title: 'Откат коммитов: git reset и его флаги',
        shortDesc: 'Разница между --soft, --mixed и опасным --hard.',
        difficulty: 'Сложно',
        durationMinutes: 7,
        xpReward: 90,
        iconName: 'Undo2',
        theory: {
          overview: '`git reset` перемещает указатель текущей ветки назад на указанный коммит. У него есть три режима:\n1. `--soft` — откатывает коммит, но оставляет ваши изменения в Staging Area (готовыми к новому коммиту).\n2. `--mixed` (по умолчанию) — откатывает коммит, изменения остаются в файлах, но убираются из индекса.\n3. `--hard` (ОПАСНО!) — полностью и безвозвратно стирает все изменения!',
          keyPoints: [
            '`git reset --soft HEAD~1` — "я забыл докинуть файл в последний коммит или хочу изменить сообщение".',
            '`git reset --hard HEAD~1` — "я написал ужасный код и хочу стереть последний коммит начисто".',
            'НИКОГДА не делайте reset коммитов, которые уже отправлены в публичный remote (origin).'
          ],
          realWorldExample: {
            situation: 'Вы случайно закоммитили файл с паролем локально и хотите отменить сам коммит, но не потерять написанный код.',
            command: 'git reset --soft HEAD~1',
            output: 'HEAD is now at a1b2c3d Initial commit',
            why: 'Коммит отменился, а файлы остались готовыми в Staging Area.'
          }
        },
        steps: [
          {
            id: 1,
            title: 'Мягкий откат последнего коммита',
            explanation: 'Выполните мягкий откат одного последнего коммита (HEAD~1) с сохранением файлов в индексе:',
            codeSnippet: 'git reset --soft HEAD~1',
            interactiveType: 'command_input',
            requiredCommand: 'git reset --soft HEAD~1',
            commandHint: 'Введите: git reset --soft HEAD~1'
          },
          {
            id: 2,
            title: 'Какой флаг самый разрушительный?',
            explanation: 'Какой флаг команды git reset безвозвратно уничтожает все изменения в рабочей директории?',
            interactiveType: 'quiz_choice',
            quizQuestion: {
              question: 'Какой флаг стирает изменения насовсем?',
              options: [
                '--soft',
                '--hard',
                '--mixed',
                '--safe'
              ],
              correctIndex: 1,
              explanation: 'Флаг `--hard` полностью переписывает файлы до состояния выбранного коммита.'
            }
          }
        ]
      },
      {
        id: 'les_4_3',
        moduleId: 'mod_4',
        title: 'Безопасная отмена: git revert',
        shortDesc: 'Как безопасно отменить опубликованный на сервере коммит без переписывания истории.',
        difficulty: 'Средне',
        durationMinutes: 5,
        xpReward: 85,
        iconName: 'ShieldAlert',
        theory: {
          overview: 'Если вы уже сделали `git push` коммита с багом на GitHub, использовать `reset` нельзя — это сломает историю у всех коллег. Правильный способ — `git revert <хэш>`. Он создает НОВЫЙ коммит, который вносит прямо противоположные изменения.',
          keyPoints: [
            '`git revert` не удаляет старый коммит из истории, а добавляет новый компенсирующий коммит.',
            'Это на 100% безопасно для командной работы и публичных веток.',
            '`git reflog` — бортовой самописец Git, куда записываются ВСЕ перемещения HEAD (позволяет восстановить даже удаленные ветки!).'
          ],
          realWorldExample: {
            situation: 'Коммит `a1b2c3d` на продакшене сломал платежи. Нужно срочно откатить его.',
            command: 'git revert a1b2c3d',
            output: '[main e4f5g6h] Revert "feat: payment integration"\n 1 file changed, 10 deletions(-)',
            why: 'Создался новый коммит с отменой бага, можно сразу делать push.'
          }
        },
        steps: [
          {
            id: 1,
            title: 'В чем ключевое отличие revert от reset?',
            explanation: 'Выберите главное отличие git revert от git reset:',
            interactiveType: 'quiz_choice',
            quizQuestion: {
              question: 'Почему в общих ветках используют revert, а не reset?',
              options: [
                'revert создает новый коммит с противоположными правками и не переписывает существующую историю',
                'revert работает быстрее',
                'reset работает только для файлов картинок',
                'revert автоматически закрывает Pull Request'
              ],
              correctIndex: 0,
              explanation: 'Revert сохраняет линейную историю, что критично для командной разработки.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mod_5',
    number: 5,
    title: 'PRO-мастерство: rebase, cherry-pick и теги',
    description: 'Продвинутые приемы для создания идеальной истории коммитов.',
    color: '#ec4899',
    iconName: 'Zap',
    lessons: [
      {
        id: 'les_5_1',
        moduleId: 'mod_5',
        title: 'Идеальная история: git rebase',
        shortDesc: 'Перебазирование коммитов, создание чистой линейной истории и золотое правило rebase.',
        difficulty: 'PRO',
        durationMinutes: 7,
        xpReward: 100,
        iconName: 'Sliders',
        theory: {
          overview: '`git rebase` (перебазирование) берет коммиты вашей ветки и пересаживает их на верхушку другой ветки (например, main). В результате получается идеально прямая линия коммитов без лишних "Merge branch \'main\' into feature".',
          keyPoints: [
            'Rebase делает историю чистой и удобной для чтения.',
            '**Золотое правило Rebase**: НИКОГДА не делайте rebase публичных веток, с которыми работают другие люди!',
            'Интерактивный ребейз (`git rebase -i HEAD~3`) позволяет объединять (squash) мелкие коммиты и редактировать сообщения.'
          ],
          realWorldExample: {
            situation: 'Вы хотите обновить свою ветку свежими изменениями из main без создания merge-коммита.',
            command: 'git rebase main',
            output: 'Successfully rebased and updated refs/heads/feature.',
            why: 'История стала красивой и линейной.'
          }
        },
        steps: [
          {
            id: 1,
            title: 'Золотое правило Rebase',
            explanation: 'Когда категорически НЕЛЬЗЯ использовать git rebase?',
            interactiveType: 'quiz_choice',
            quizQuestion: {
              question: 'Главное ограничение git rebase:',
              options: [
                'Нельзя делать rebase в общих публичных ветках (например, main/master на сервере)',
                'Нельзя делать rebase по пятницам',
                'Нельзя делать rebase, если в проекте больше 10 файлов',
                'Rebase можно делать всегда и везде без ограничений'
              ],
              correctIndex: 0,
              explanation: 'Rebase переписывает хэши коммитов, что создаст хаос и рассинхронизацию у всех остальных членов команды.'
            }
          }
        ]
      },
      {
        id: 'les_5_2',
        moduleId: 'mod_5',
        title: 'Выборочный перенос: git cherry-pick',
        shortDesc: 'Как забрать один конкретный нужный коммит из другой ветки.',
        difficulty: 'PRO',
        durationMinutes: 5,
        xpReward: 95,
        iconName: 'Target',
        theory: {
          overview: 'Представьте: коллега в ветке `experiment` сделал классный хотфикс бага, но всю ветку целиком вливать нельзя (там куча незаконченного кода). Команда `git cherry-pick <хэш>` позволяет "сорвать вишенку" — скопировать ТОЛЬКО этот один коммит в вашу текущую ветку.',
          keyPoints: [
            '`git cherry-pick a1b2c3d` копирует коммит `a1b2c3d` и применяет его поверх текущего HEAD.',
            'Создается новый коммит с новым хэшем, но с тем же кодом и сообщением.'
          ],
          realWorldExample: {
            situation: 'Нужно перенести фикс бага с хэшем `a1b2c3d` в ветку `production`.',
            command: 'git cherry-pick a1b2c3d',
            output: '[production e4f5g6h] fix: critical auth bug\n 1 file changed, 2 insertions(+)',
            why: 'Хотфикс применен без лишнего кода.'
          }
        },
        steps: [
          {
            id: 1,
            title: 'Соберите команду cherry-pick',
            explanation: 'Соберите команду переноса коммита с хэшем `c3d4e5f`:',
            interactiveType: 'command_order',
            orderTokens: ['git', 'cherry-pick', 'c3d4e5f']
          }
        ]
      },
      {
        id: 'les_5_3',
        moduleId: 'mod_5',
        title: 'Релизы и теги версий: git tag',
        shortDesc: 'Маркируем важные контрольные точки релизов v1.0.0.',
        difficulty: 'Средне',
        durationMinutes: 4,
        xpReward: 70,
        iconName: 'Tag',
        theory: {
          overview: 'Теги (Tags) — это постоянные закладки на конкретные коммиты. В отличие от веток, теги не двигаются при добавлении новых коммитов. Их используют для маркировки релизов (например, `v1.0.0`, `v2.1.3`).',
          keyPoints: [
            '`git tag v1.0.0` — создает легковесный тег на текущем коммите.',
            '`git tag -a v1.0.0 -m "Релиз версии 1.0"` — аннотированный тег с описанием и автором.',
            '`git push origin --tags` — отправляет все теги на сервер (по умолчанию push теги не шлет).'
          ],
          realWorldExample: {
            situation: 'Проект протестирован и готов к выпуску версии 1.0.0.',
            command: 'git tag -a v1.0.0 -m "Первый стабильный релиз"',
            output: '',
            why: 'На GitHub автоматически создастся релиз с архивом исходников.'
          }
        },
        steps: [
          {
            id: 1,
            title: 'Создаем тег версии',
            explanation: 'Выполните команду для создания тега версии `v1.0.0`:',
            codeSnippet: 'git tag v1.0.0',
            interactiveType: 'command_input',
            requiredCommand: 'git tag v1.0.0',
            commandHint: 'Введите: git tag v1.0.0'
          }
        ]
      }
    ]
  }
];
