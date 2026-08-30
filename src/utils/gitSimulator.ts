import { GitState, GitCommit, GitBranch } from '../types';

export const BRANCH_COLORS = [
  '#3b82f6', // blue (main/master)
  '#10b981', // emerald (feature)
  '#f59e0b', // amber (bugfix)
  '#8b5cf6', // purple (dev)
  '#ec4899', // pink (hotfix)
  '#06b6d4', // cyan (experiment)
];

export const INITIAL_GIT_STATE: GitState = {
  commits: [
    {
      id: 'c1',
      hash: 'a1b2c3d',
      message: 'Начальный коммит: инициализация проекта',
      author: 'Разработчик <dev@gitmaster.io>',
      timestamp: 'Сегодня, 10:00',
      parentId: null,
      branch: 'main',
      color: BRANCH_COLORS[0],
      files: [{ name: 'README.md', status: 'added' }]
    },
    {
      id: 'c2',
      hash: 'e4f5g6h',
      message: 'feat: добавлена разметка главной страницы',
      author: 'Разработчик <dev@gitmaster.io>',
      timestamp: 'Сегодня, 10:45',
      parentId: 'c1',
      branch: 'main',
      color: BRANCH_COLORS[0],
      files: [{ name: 'index.html', status: 'added' }, { name: 'style.css', status: 'added' }]
    }
  ],
  branches: [
    { name: 'main', commitId: 'c2', color: BRANCH_COLORS[0] },
    { name: 'feature/login', commitId: 'c2', color: BRANCH_COLORS[1] }
  ],
  activeBranch: 'main',
  headCommitId: 'c2',
  stagingArea: [],
  workingDirectory: [
    { name: 'app.js', status: 'untracked' },
    { name: 'config.json', status: 'untracked' }
  ],
  stashList: [],
  remoteBranches: [
    { name: 'origin/main', commitId: 'c2', color: '#64748b', isRemote: true }
  ],
  tags: [
    { name: 'v0.1', commitId: 'c1' }
  ],
  commandHistory: [],
  terminalOutput: [
    {
      type: 'info',
      text: 'Добро пожаловать в GitMaster Терминал v2.4!\nВведите команду (например `git status`, `git log`, `git branch` или `help`).'
    }
  ]
};

function generateHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 7; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

export function executeGitCommand(
  rawCommand: string,
  state: GitState
): { newState: GitState; output: { type: 'cmd' | 'output' | 'error' | 'success' | 'info'; text: string } } {
  const trimmed = rawCommand.trim();
  if (!trimmed) {
    return {
      newState: state,
      output: { type: 'cmd', text: '' }
    };
  }

  const newState: GitState = JSON.parse(JSON.stringify(state));
  newState.commandHistory.push(trimmed);

  const parts = trimmed.split(/\s+/);
  const root = parts[0].toLowerCase();
  const sub = parts[1]?.toLowerCase();
  const args = parts.slice(2);

  // Non-git commands
  if (root === 'clear') {
    newState.terminalOutput = [];
    return {
      newState,
      output: { type: 'info', text: 'Терминал очищен.' }
    };
  }

  if (root === 'help' || (root === 'git' && sub === 'help') || (root === 'git' && !sub)) {
    const helpText = `Доступные команды GitMaster:
  git status                — Показать состояние рабочей директории и индекса
  git add <файл> / git add . — Добавить файлы в индекс (Staging Area)
  git commit -m "сообщение"  — Создать новый коммит с сообщением
  git branch                — Показать список веток
  git branch <имя>          — Создать новую ветку
  git branch -d <имя>       — Удалить ветку
  git checkout <ветка>      — Переключиться на ветку
  git checkout -b <ветка>   — Создать ветку и сразу перейти на неё
  git switch <ветка>        — Современный аналог checkout для смены ветки
  git switch -c <ветка>     — Создать ветку и перейти
  git merge <ветка>         — Слить указанную ветку в текущую
  git log / git log --oneline — Просмотреть историю коммитов
  git stash                 — Спрятать незакоммиченные изменения
  git stash pop             — Восстановить спрятанные изменения
  git stash list            — Показать список стешей
  git reset --soft HEAD~1   — Откатить коммит, сохранив изменения в индексе
  git reset --hard HEAD~1   — Полный откат последнего коммита
  git revert <хэш>          — Создать коммит, отменяющий указанный
  git tag <имя_тега>        — Повесить тег версии
  git push                  — Отправить коммиты на удалённый origin
  git pull                  — Скачать и влить изменения с сервера
  clear                     — Очистить экран терминала`;
    return {
      newState,
      output: { type: 'output', text: helpText }
    };
  }

  if (root !== 'git') {
    return {
      newState,
      output: { type: 'error', text: `zsh: команда не найдена: ${root}. Введите 'git <команда>' или 'help'.` }
    };
  }

  // --- GIT COMMANDS ---

  // git status
  if (sub === 'status') {
    const branch = newState.branches.find(b => b.name === newState.activeBranch);
    let statusText = `На ветке ${newState.activeBranch}\n`;

    const remote = newState.remoteBranches.find(r => r.name === `origin/${newState.activeBranch}`);
    if (remote) {
      if (remote.commitId === branch?.commitId) {
        statusText += `Ваша ветка синхронизирована с 'origin/${newState.activeBranch}'.\n\n`;
      } else {
        statusText += `Ваша ветка опережает 'origin/${newState.activeBranch}' на 1 коммит.\n  (используйте "git push", чтобы опубликовать ваши коммиты)\n\n`;
      }
    }

    if (newState.stagingArea.length > 0) {
      statusText += `Изменения, готовые к коммиту:\n  (используйте "git restore --staged <file>...", чтобы убрать из индекса)\n`;
      newState.stagingArea.forEach(f => {
        statusText += `\t\x1b[32mновый файл:    ${f.name}\x1b[0m\n`;
      });
      statusText += '\n';
    }

    if (newState.workingDirectory.length > 0) {
      statusText += `Неотслеживаемые файлы:\n  (используйте "git add <file>...", чтобы включить в коммит)\n`;
      newState.workingDirectory.forEach(f => {
        statusText += `\t\x1b[31m${f.name}\x1b[0m\n`;
      });
      statusText += '\nиндекс пуст, но есть неотслеживаемые файлы (используйте "git add")';
    } else if (newState.stagingArea.length === 0) {
      statusText += `рабочая директория чиста, нечего коммитить`;
    }

    return {
      newState,
      output: { type: 'output', text: statusText }
    };
  }

  // git add
  if (sub === 'add') {
    const target = args[0];
    if (!target) {
      return {
        newState,
        output: { type: 'error', text: 'Фатальная ошибка: не указан файл для добавления. Пример: git add . или git add app.js' }
      };
    }

    if (target === '.' || target === '-A' || target === '--all') {
      if (newState.workingDirectory.length === 0) {
        return {
          newState,
          output: { type: 'output', text: 'Нечего добавлять: рабочая директория чиста.' }
        };
      }
      const addedFiles = [...newState.workingDirectory];
      newState.stagingArea.push(...addedFiles);
      newState.workingDirectory = [];
      return {
        newState,
        output: { type: 'success', text: `Добавлено в индекс (${addedFiles.length} файл(ов)): ${addedFiles.map(f => f.name).join(', ')}` }
      };
    } else {
      const idx = newState.workingDirectory.findIndex(f => f.name.toLowerCase() === target.toLowerCase());
      if (idx !== -1) {
        const file = newState.workingDirectory.splice(idx, 1)[0];
        newState.stagingArea.push(file);
        return {
          newState,
          output: { type: 'success', text: `Файл '${file.name}' успешно добавлен в индекс.` }
        };
      } else {
        return {
          newState,
          output: { type: 'error', text: `фатально: путь '${target}' не соответствует ни одному файлу` }
        };
      }
    }
  }

  // git commit
  if (sub === 'commit') {
    let message = '';
    const mIndex = trimmed.indexOf('-m');
    if (mIndex !== -1) {
      const rest = trimmed.substring(mIndex + 2).trim();
      if ((rest.startsWith('"') && rest.endsWith('"')) || (rest.startsWith("'") && rest.endsWith("'"))) {
        message = rest.substring(1, rest.length - 1);
      } else {
        message = rest.replace(/^["']/, '').replace(/["']$/, '');
      }
    }

    // Support -a or -am (auto stage tracked files)
    const isAutoStage = trimmed.includes('-a') || trimmed.includes('-am');
    if (isAutoStage && newState.workingDirectory.length > 0) {
      newState.stagingArea.push(...newState.workingDirectory);
      newState.workingDirectory = [];
    }

    if (!message) {
      return {
        newState,
        output: { type: 'error', text: 'Ошибка: укажите сообщение коммита с флагом -m "текст". Например: git commit -m "feat: новый функционал"' }
      };
    }

    if (newState.stagingArea.length === 0) {
      return {
        newState,
        output: { type: 'error', text: 'На ветке ' + newState.activeBranch + '\nНечего коммитить, рабочая директория чиста (сначала сделайте "git add")' }
      };
    }

    const currentBranchObj = newState.branches.find(b => b.name === newState.activeBranch);
    const color = currentBranchObj?.color || BRANCH_COLORS[0];
    const newHash = generateHash();
    const newCommitId = 'c_' + Date.now();

    const committedFiles = [...newState.stagingArea];
    newState.stagingArea = [];

    const newCommit: GitCommit = {
      id: newCommitId,
      hash: newHash,
      message: message,
      author: 'Вы <student@gitmaster.io>',
      timestamp: 'Только что',
      parentId: newState.headCommitId,
      branch: newState.activeBranch,
      color: color,
      files: committedFiles.map(f => ({ name: f.name, status: 'added' }))
    };

    newState.commits.push(newCommit);
    newState.headCommitId = newCommitId;

    if (currentBranchObj) {
      currentBranchObj.commitId = newCommitId;
    }

    return {
      newState,
      output: {
        type: 'success',
        text: `[${newState.activeBranch} ${newHash}] ${message}\n ${committedFiles.length} файл(ов) изменено: ${committedFiles.map(f => f.name).join(', ')}`
      }
    };
  }

  // git branch
  if (sub === 'branch') {
    // git branch -d <name>
    if (args[0] === '-d' || args[0] === '-D') {
      const branchToDelete = args[1];
      if (!branchToDelete) {
        return { newState, output: { type: 'error', text: 'Укажите имя ветки для удаления: git branch -d <имя>' } };
      }
      if (branchToDelete === newState.activeBranch) {
        return { newState, output: { type: 'error', text: `ошибка: Нельзя удалить текущую активную ветку '${branchToDelete}'. Переключитесь на другую.` } };
      }
      const bIdx = newState.branches.findIndex(b => b.name === branchToDelete);
      if (bIdx === -1) {
        return { newState, output: { type: 'error', text: `ошибка: ветка '${branchToDelete}' не найдена.` } };
      }
      newState.branches.splice(bIdx, 1);
      return { newState, output: { type: 'success', text: `Удалена ветка ${branchToDelete}.` } };
    }

    // List branches
    if (args.length === 0) {
      const list = newState.branches
        .map(b => (b.name === newState.activeBranch ? `* \x1b[32m${b.name}\x1b[0m` : `  ${b.name}`))
        .join('\n');
      return {
        newState,
        output: { type: 'output', text: list }
      };
    }

    // Create branch: git branch <name>
    const newBranchName = args[0];
    if (newState.branches.some(b => b.name === newBranchName)) {
      return {
        newState,
        output: { type: 'error', text: `фатально: ветка '${newBranchName}' уже существует.` }
      };
    }

    const nextColor = BRANCH_COLORS[newState.branches.length % BRANCH_COLORS.length];
    newState.branches.push({
      name: newBranchName,
      commitId: newState.headCommitId,
      color: nextColor
    });

    return {
      newState,
      output: { type: 'success', text: `Создана новая ветка '${newBranchName}' (указывает на коммит ${newState.headCommitId}).` }
    };
  }

  // git checkout or git switch
  if (sub === 'checkout' || sub === 'switch') {
    const isCreateFlag = args[0] === '-b' || args[0] === '-c';
    const targetBranch = isCreateFlag ? args[1] : args[0];

    if (!targetBranch) {
      return {
        newState,
        output: { type: 'error', text: `Укажите ветку. Пример: git ${sub} main или git ${sub} -b feature/auth` }
      };
    }

    if (isCreateFlag) {
      if (newState.branches.some(b => b.name === targetBranch)) {
        return {
          newState,
          output: { type: 'error', text: `фатально: ветка '${targetBranch}' уже существует` }
        };
      }
      const nextColor = BRANCH_COLORS[newState.branches.length % BRANCH_COLORS.length];
      newState.branches.push({
        name: targetBranch,
        commitId: newState.headCommitId,
        color: nextColor
      });
      newState.activeBranch = targetBranch;
      return {
        newState,
        output: { type: 'success', text: `Переключено на новую ветку '${targetBranch}'` }
      };
    } else {
      const found = newState.branches.find(b => b.name === targetBranch);
      if (!found) {
        return {
          newState,
          output: { type: 'error', text: `ошибка: путь '${targetBranch}' не найден. Для создания используйте -b` }
        };
      }
      newState.activeBranch = targetBranch;
      newState.headCommitId = found.commitId;
      return {
        newState,
        output: { type: 'success', text: `Переключено на ветку '${targetBranch}'` }
      };
    }
  }

  // git merge
  if (sub === 'merge') {
    const sourceBranchName = args[0];
    if (!sourceBranchName) {
      return {
        newState,
        output: { type: 'error', text: 'Укажите ветку для слияния: git merge <имя_ветки>' }
      };
    }

    if (sourceBranchName === newState.activeBranch) {
      return {
        newState,
        output: { type: 'info', text: 'Уже актуально (Already up to date).' }
      };
    }

    const sourceBranch = newState.branches.find(b => b.name === sourceBranchName);
    if (!sourceBranch) {
      return {
        newState,
        output: { type: 'error', text: `слияние: '${sourceBranchName}' - ветка не найдена` }
      };
    }

    const currentBranchObj = newState.branches.find(b => b.name === newState.activeBranch);
    const newHash = generateHash();
    const newCommitId = 'merge_' + Date.now();

    const mergeCommit: GitCommit = {
      id: newCommitId,
      hash: newHash,
      message: `Merge branch '${sourceBranchName}' into ${newState.activeBranch}`,
      author: 'Вы <student@gitmaster.io>',
      timestamp: 'Только что',
      parentId: newState.headCommitId,
      parent2Id: sourceBranch.commitId,
      branch: newState.activeBranch,
      color: currentBranchObj?.color || BRANCH_COLORS[0],
      files: [{ name: 'merge-resolve.ts', status: 'modified' }]
    };

    newState.commits.push(mergeCommit);
    newState.headCommitId = newCommitId;
    if (currentBranchObj) {
      currentBranchObj.commitId = newCommitId;
    }

    return {
      newState,
      output: {
        type: 'success',
        text: `Слияние ветки '${sourceBranchName}' в '${newState.activeBranch}' успешно выполнено!\nСоздан коммит слияния: ${newHash}`
      }
    };
  }

  // git log
  if (sub === 'log') {
    const isOneline = args.includes('--oneline');
    if (isOneline) {
      const onelineLogs = [...newState.commits]
        .reverse()
        .map(c => `\x1b[33m${c.hash}\x1b[0m (${c.branch === newState.activeBranch ? `\x1b[32mHEAD -> ${c.branch}\x1b[0m` : c.branch}) ${c.message}`)
        .join('\n');
      return {
        newState,
        output: { type: 'output', text: onelineLogs }
      };
    }

    const logs = [...newState.commits]
      .reverse()
      .map(c => {
        let header = `\x1b[33mcommit ${c.hash}\x1b[0m`;
        if (c.id === newState.headCommitId) {
          header += ` (\x1b[36mHEAD -> \x1b[32m${c.branch}\x1b[0m)`;
        }
        return `${header}\nАвтор: ${c.author}\nДата:   ${c.timestamp}\n\n    ${c.message}\n`;
      })
      .join('\n');

    return {
      newState,
      output: { type: 'output', text: logs }
    };
  }

  // git stash
  if (sub === 'stash') {
    const stashSub = args[0];
    if (!stashSub || stashSub === 'push' || stashSub === 'save') {
      if (newState.workingDirectory.length === 0 && newState.stagingArea.length === 0) {
        return {
          newState,
          output: { type: 'info', text: 'Нет локальных изменений для сохранения в stash.' }
        };
      }
      const files = [...newState.workingDirectory.map(f => f.name), ...newState.stagingArea.map(f => f.name)];
      const stashId = `stash@{${newState.stashList.length}}`;
      const stashMsg = `WIP on ${newState.activeBranch}: ${newState.headCommitId.slice(0, 7)}`;
      newState.stashList.unshift({
        id: stashId,
        message: stashMsg,
        branch: newState.activeBranch,
        files: files
      });
      newState.workingDirectory = [];
      newState.stagingArea = [];
      return {
        newState,
        output: { type: 'success', text: `Сохранен рабочий каталог и статус индекса: ${stashMsg}` }
      };
    } else if (stashSub === 'pop') {
      if (newState.stashList.length === 0) {
        return {
          newState,
          output: { type: 'error', text: 'ошибка: Нет записей в stash для восстановления.' }
        };
      }
      const popped = newState.stashList.shift()!;
      popped.files.forEach(f => {
        newState.workingDirectory.push({ name: f, status: 'modified' });
      });
      return {
        newState,
        output: { type: 'success', text: `Изменения из ${popped.id} применены и удалены из стеша.` }
      };
    } else if (stashSub === 'list') {
      if (newState.stashList.length === 0) {
        return { newState, output: { type: 'info', text: 'Список stash пуст.' } };
      }
      const list = newState.stashList.map(s => `${s.id}: ${s.message}`).join('\n');
      return { newState, output: { type: 'output', text: list } };
    }
  }

  // git reset
  if (sub === 'reset') {
    const isHard = args.includes('--hard');
    const isSoft = args.includes('--soft');

    if (newState.commits.length <= 1) {
      return {
        newState,
        output: { type: 'error', text: 'Нельзя откатить единственный начальный коммит.' }
      };
    }

    const poppedCommit = newState.commits.pop()!;
    const prevCommit = newState.commits[newState.commits.length - 1];
    newState.headCommitId = prevCommit.id;
    const branch = newState.branches.find(b => b.name === newState.activeBranch);
    if (branch) {
      branch.commitId = prevCommit.id;
    }

    if (isHard) {
      newState.workingDirectory = [];
      newState.stagingArea = [];
      return {
        newState,
        output: { type: 'output', text: `HEAD сейчас на ${prevCommit.hash} ${prevCommit.message} (все изменения удалены)` }
      };
    } else if (isSoft) {
      if (poppedCommit.files) {
        poppedCommit.files.forEach(f => {
          newState.stagingArea.push({ name: f.name, status: 'modified' });
        });
      }
      return {
        newState,
        output: { type: 'success', text: `HEAD откатан к ${prevCommit.hash}. Файлы коммита сохранены в Staging Area.` }
      };
    } else {
      if (poppedCommit.files) {
        poppedCommit.files.forEach(f => {
          newState.workingDirectory.push({ name: f.name, status: 'modified' });
        });
      }
      return {
        newState,
        output: { type: 'output', text: `Неиндексированные изменения после сброса:\nM\t${poppedCommit.files?.map(f => f.name).join('\n') || ''}` }
      };
    }
  }

  // git revert
  if (sub === 'revert') {
    const targetHash = args[0];
    if (!targetHash) {
      return {
        newState,
        output: { type: 'error', text: 'Укажите хэш коммита для отмены: git revert <hash>' }
      };
    }
    const targetCommit = newState.commits.find(c => c.hash.startsWith(targetHash) || c.id === targetHash);
    if (!targetCommit) {
      return {
        newState,
        output: { type: 'error', text: `фатально: коммит '${targetHash}' не найден` }
      };
    }

    const newHash = generateHash();
    const newCommitId = 'rev_' + Date.now();
    const revCommit: GitCommit = {
      id: newCommitId,
      hash: newHash,
      message: `Revert "${targetCommit.message}"`,
      author: 'Вы <student@gitmaster.io>',
      timestamp: 'Только что',
      parentId: newState.headCommitId,
      branch: newState.activeBranch,
      color: BRANCH_COLORS[0]
    };
    newState.commits.push(revCommit);
    newState.headCommitId = newCommitId;
    const branch = newState.branches.find(b => b.name === newState.activeBranch);
    if (branch) branch.commitId = newCommitId;

    return {
      newState,
      output: { type: 'success', text: `[${newState.activeBranch} ${newHash}] Revert "${targetCommit.message}"\nСоздан новый коммит, отменяющий изменения.` }
    };
  }

  // git tag
  if (sub === 'tag') {
    const tagName = args[0];
    if (!tagName) {
      if (newState.tags.length === 0) {
        return { newState, output: { type: 'info', text: 'Тегов пока нет.' } };
      }
      return {
        newState,
        output: { type: 'output', text: newState.tags.map(t => t.name).join('\n') }
      };
    }
    newState.tags.push({ name: tagName, commitId: newState.headCommitId });
    return {
      newState,
      output: { type: 'success', text: `Создан тег '${tagName}' на текущем коммите (${newState.headCommitId}).` }
    };
  }

  // git push
  if (sub === 'push') {
    let remote = newState.remoteBranches.find(r => r.name === `origin/${newState.activeBranch}`);
    if (!remote) {
      remote = {
        name: `origin/${newState.activeBranch}`,
        commitId: newState.headCommitId,
        color: '#64748b',
        isRemote: true
      };
      newState.remoteBranches.push(remote);
    } else {
      remote.commitId = newState.headCommitId;
    }
    return {
      newState,
      output: {
        type: 'success',
        text: `Все объекты загружены на GitHub/GitLab.\nВетка '${newState.activeBranch}' отправлена в 'origin/${newState.activeBranch}'.`
      }
    };
  }

  // git pull
  if (sub === 'pull') {
    return {
      newState,
      output: { type: 'info', text: 'Уже актуально (Already up to date).' }
    };
  }

  // git fetch
  if (sub === 'fetch') {
    return {
      newState,
      output: {
        type: 'success',
        text: `С удаленного репозитория origin получены свежие ссылки и объекты.\nЛокальные ветки не изменены (используйте "git merge origin/${newState.activeBranch}" или "git pull").`
      }
    };
  }

  // git diff
  if (sub === 'diff') {
    const isStaged = args.includes('--staged') || args.includes('--cached');
    if (isStaged) {
      if (newState.stagingArea.length === 0) {
        return { newState, output: { type: 'info', text: 'Индекс пуст (нет проиндексированных изменений для diff).' } };
      }
      const diffText = newState.stagingArea.map(f => `diff --git a/${f.name} b/${f.name}\nindex 0000000..a1b2c3d 100644\n--- /dev/null\n+++ b/${f.name}\n@@ -0,0 +1,5 @@\n+\x1b[32m+// Added new content into ${f.name}\x1b[0m\n+\x1b[32m+export const ready = true;\x1b[0m`).join('\n\n');
      return { newState, output: { type: 'output', text: diffText } };
    } else {
      if (newState.workingDirectory.length === 0) {
        return { newState, output: { type: 'info', text: 'Нет незаиндексированных изменений в рабочей директории.' } };
      }
      const diffText = newState.workingDirectory.map(f => `diff --git a/${f.name} b/${f.name}\n--- a/${f.name}\n+++ b/${f.name}\n@@ -10,3 +10,4 @@\n \x1b[31m-const oldCode = false;\x1b[0m\n \x1b[32m+const updatedCode = true;\x1b[0m`).join('\n\n');
      return { newState, output: { type: 'output', text: diffText } };
    }
  }

  // git restore
  if (sub === 'restore') {
    const isStaged = args.includes('--staged');
    const targetFile = args.filter(a => !a.startsWith('-'))[0];

    if (isStaged) {
      if (newState.stagingArea.length === 0) {
        return { newState, output: { type: 'info', text: 'Индекс пуст, нечего убирать.' } };
      }
      if (targetFile && targetFile !== '.') {
        const idx = newState.stagingArea.findIndex(f => f.name.toLowerCase() === targetFile.toLowerCase());
        if (idx !== -1) {
          const file = newState.stagingArea.splice(idx, 1)[0];
          newState.workingDirectory.push(file);
          return { newState, output: { type: 'success', text: `Файл '${file.name}' убран из индекса (unstaged).` } };
        }
      } else {
        newState.workingDirectory.push(...newState.stagingArea);
        newState.stagingArea = [];
        return { newState, output: { type: 'success', text: 'Все файлы убраны из индекса.' } };
      }
    } else {
      if (targetFile && targetFile !== '.') {
        const idx = newState.workingDirectory.findIndex(f => f.name.toLowerCase() === targetFile.toLowerCase());
        if (idx !== -1) {
          newState.workingDirectory.splice(idx, 1);
          return { newState, output: { type: 'success', text: `Изменения в '${targetFile}' отменены.` } };
        }
      } else {
        newState.workingDirectory = [];
        return { newState, output: { type: 'success', text: 'Все незафиксированные изменения в рабочей директории отменены.' } };
      }
    }
  }

  // git remote
  if (sub === 'remote') {
    const isV = args.includes('-v');
    if (isV) {
      return {
        newState,
        output: {
          type: 'output',
          text: `origin\thttps://github.com/developer/git-master-project.git (fetch)\norigin\thttps://github.com/developer/git-master-project.git (push)`
        }
      };
    }
    return {
      newState,
      output: { type: 'output', text: 'origin' }
    };
  }

  // git clone
  if (sub === 'clone') {
    const url = args[0] || 'https://github.com/developer/project.git';
    return {
      newState,
      output: {
        type: 'success',
        text: `Клонирование в '${url.split('/').pop()?.replace('.git', '') || 'project'}'...\nУдаленный сервер: подсчет объектов: 100% (42/42), готово.\nРаспаковка объектов: 100% (42/42), 12.4 KiB | 2.4 MiB/s, готово.`
      }
    };
  }

  // git cherry-pick
  if (sub === 'cherry-pick') {
    const targetHash = args[0];
    if (!targetHash) {
      return { newState, output: { type: 'error', text: 'Укажите хэш коммита для переноса: git cherry-pick <hash>' } };
    }
    const foundCommit = newState.commits.find(c => c.hash.startsWith(targetHash) || c.id === targetHash);
    if (!foundCommit) {
      return { newState, output: { type: 'error', text: `ошибка: коммит '${targetHash}' не существует` } };
    }

    const currentBranchObj = newState.branches.find(b => b.name === newState.activeBranch);
    const newHash = generateHash();
    const newCommitId = 'cp_' + Date.now();

    const cpCommit: GitCommit = {
      id: newCommitId,
      hash: newHash,
      message: `${foundCommit.message} (cherry-picked)`,
      author: foundCommit.author,
      timestamp: 'Только что',
      parentId: newState.headCommitId,
      branch: newState.activeBranch,
      color: currentBranchObj?.color || BRANCH_COLORS[0],
      files: foundCommit.files ? [...foundCommit.files] : [{ name: 'feature.ts', status: 'added' }]
    };

    newState.commits.push(cpCommit);
    newState.headCommitId = newCommitId;
    if (currentBranchObj) {
      currentBranchObj.commitId = newCommitId;
    }

    return {
      newState,
      output: {
        type: 'success',
        text: `[${newState.activeBranch} ${newHash}] ${foundCommit.message} (cherry-picked)\nКоммит успешно перенесён в текущую ветку!`
      }
    };
  }

  // git rebase
  if (sub === 'rebase') {
    const targetBranchName = args[0];
    if (!targetBranchName) {
      return { newState, output: { type: 'error', text: 'Укажите ветку для rebase: git rebase <ветка>' } };
    }
    const targetBranch = newState.branches.find(b => b.name === targetBranchName);
    if (!targetBranch) {
      return { newState, output: { type: 'error', text: `фатально: ветка '${targetBranchName}' не найдена` } };
    }
    if (targetBranchName === newState.activeBranch) {
      return { newState, output: { type: 'info', text: 'Текущая ветка уже находится на вершине целевой.' } };
    }

    return {
      newState,
      output: {
        type: 'success',
        text: `Успешно перебазирована и обновлена ссылка refs/heads/${newState.activeBranch}.\nИстория линейно выстроена поверх '${targetBranchName}'.`
      }
    };
  }

  // git clean
  if (sub === 'clean') {
    const count = newState.workingDirectory.length;
    newState.workingDirectory = [];
    return {
      newState,
      output: {
        type: 'success',
        text: count > 0 ? `Удалено ${count} неотслеживаемых файлов.` : 'Нечего удалять: рабочая директория чиста.'
      }
    };
  }

  // git init
  if (sub === 'init') {
    return {
      newState,
      output: {
        type: 'success',
        text: 'Инициализирован пустой Git репозиторий в /workspace/git-project/.git/'
      }
    };
  }

  // git config
  if (sub === 'config') {
    return {
      newState,
      output: {
        type: 'output',
        text: `user.name=Студент GitMaster\nuser.email=dev@gitmaster.io\ncore.autocrlf=input\ninit.defaultBranch=main`
      }
    };
  }

  // fallback unknown git subcommand
  return {
    newState,
    output: {
      type: 'error',
      text: `git: '${sub}' не является командой git. Введите 'git help' для списка поддерживаемых команд.`
    }
  };
}
