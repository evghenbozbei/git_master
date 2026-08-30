# Git Master

Git Master is a mobile-first interactive learning app for practicing Git concepts through guided lessons, terminal exercises, cheatsheets, and progress tracking.

The project is built with React, TypeScript, Vite, and Capacitor for Android support.

## Features

- Interactive Git roadmap and lesson progression
- Practice exercises and mistake tracking
- Terminal-based sandbox for command practice
- Git cheatsheet with commands and examples
- User profile and level progression
- Android app packaging via Capacitor

## Tech Stack

- React 19
- TypeScript
- Vite
- Capacitor Android
- Tailwind CSS
- Motion library for UI transitions

## Project Structure

```bash
.
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
├── android/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── capacitor.config.ts
├── .gitignore
├── .env.example
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app locally

```bash
npm run dev
```

The app runs on port 3000 by default.

### 3. Build for production

```bash
npm run build
```

### 4. Open Android app

```bash
npx cap sync android
npx cap open android
```

## Available Scripts

```bash
npm run dev      # start Vite dev server
npm run build    # build production bundle
npm run preview  # preview production build
npm run lint     # TypeScript check
```

## GitHub Repository

This project is connected to:

```bash
https://github.com/evghenbozbei/git_master.git
```

## Notes

- Local Android generated files and build artifacts are ignored via `.gitignore`.
- Keep environment-sensitive files such as `.env` out of version control.
- Use `.env.example` as a template for local environment values.

## License

This project is for personal learning and development use.
