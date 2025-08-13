# TypeScript + React + Vite Preferences

**Purpose**: This file defines the preferred technology choices, patterns, and configurations for TypeScript React projects using Vite. It serves as the authoritative guide for AI-assisted development of modern React applications.

**Instructions**: The AI should reference this file when making technology decisions for TypeScript React projects. Users can override these preferences by editing this file or specifying overrides in PROJECT_DETAILS.md.

---

## Core Stack

**Runtime**: 
Node.js 18+ (Bun also supported for faster builds)

**Package Manager**: 
pnpm (preferred for speed and efficiency)

**Build Tool**: 
Vite (fast development server and optimized production builds)

**Language**: 
TypeScript with strict mode enabled

**Framework**: 
React 18+ with functional components and hooks

## Development Environment

**Code Quality**:
- ESLint with TypeScript and React rules
- Prettier for code formatting
- TypeScript strict mode configuration
- Pre-commit hooks with Husky (optional)

**Testing Stack**:
- Vitest (Vite-native test runner)
- React Testing Library (component testing)
- @testing-library/jest-dom (custom matchers)
- Coverage reporting enabled

**Development Tools**:
- VS Code with TypeScript and ESLint extensions
- React DevTools browser extension
- Vite DevTools (optional)

## Project Structure

**Recommended Directory Layout**:
```
src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── styles/             # Global styles and themes
├── __tests__/          # Test files
└── main.tsx            # Application entry point
```

**File Naming Conventions**:
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase starting with "use" (e.g., `useUserData.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types: PascalCase (e.g., `UserTypes.ts`)

## Styling Approach

**Preferred Options** (in order of preference):
1. **CSS Modules** - Scoped styles, good TypeScript integration
2. **Tailwind CSS** - Utility-first, rapid development
3. **Styled Components** - CSS-in-JS with TypeScript support

**Configuration**:
- PostCSS for CSS processing
- Autoprefixer for browser compatibility
- CSS variables for theming

## Component Patterns

**Preferred Patterns**:
- Functional components with hooks
- TypeScript interfaces for props
- Default exports for components
- Named exports for utilities and hooks

**Example Component Structure**:
```typescript
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export default function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // Component logic
}
```

## State Management

**Recommended Approach** (by complexity):
- **Built-in React state** - useState, useReducer for local state
- **Context API** - For shared state across components
- **Zustand** - Lightweight global state (if needed)
- **React Query/TanStack Query** - Server state management

## API Integration

**HTTP Client**: 
Fetch API (built-in) or Axios for complex needs

**Data Fetching Patterns**:
- Custom hooks for API calls
- React Query for server state caching
- Error boundaries for error handling

## Build Configuration

**Vite Configuration Preferences**:
- TypeScript path mapping (@ for src/)
- Environment variable handling
- Bundle analysis tools
- Optimized chunk splitting

**Environment Files**:
- `.env.local` for local development
- `.env.production` for production builds
- Type-safe environment variables

## Deployment

**Preferred Platforms**:
1. **Vercel** - Excellent React/Vite support, zero config
2. **Netlify** - Good static hosting, form handling
3. **GitHub Pages** - Free hosting for open source

**Build Output**:
- Static files in `dist/` directory
- Optimized assets and code splitting
- Source maps for debugging (development only)

## Performance Considerations

**Code Splitting**:
- Route-based splitting with React.lazy
- Component-level splitting for large components
- Dynamic imports for heavy libraries

**Bundle Optimization**:
- Tree shaking enabled by default
- Dead code elimination
- Asset optimization (images, fonts)

## Bootstrap Configuration

**Scaffolding Command**:
```bash
pnpm create vite@latest [project-name] --template react-ts
```

**Package Manager**: 
pnpm (preferred for speed and efficiency)

**Essential Dependencies to Add**:
```bash
# Development dependencies
pnpm add -D @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser
pnpm add -D eslint-plugin-react-hooks eslint-plugin-react-refresh
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D vitest jsdom @vitest/ui

# Production dependencies (if needed)
pnpm add react-router-dom  # For routing
```

**Required Configuration Files**:

1. **tsconfig.json** (Enhanced):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

2. **eslint.config.js**:
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'

export default [
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
```

3. **.prettierrc**:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

4. **vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

**Directory Structure to Create**:
```
src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── styles/             # Global styles and themes
├── test/               # Test setup and utilities
└── __tests__/          # Test files
```

**Initial Files to Create**:
- `src/test/setup.ts` - Test environment setup
- `src/types/index.ts` - Global type definitions
- `src/utils/index.ts` - Utility functions
- `src/components/index.ts` - Component exports
- `.gitignore` - Appropriate for Node.js/React projects

**VS Code Configuration** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

**VS Code Extensions** (`.vscode/extensions.json`):
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

**Git Hooks Setup**:
```bash
# Optional: Set up pre-commit hooks for code quality
pnpm add -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

**lint-staged Configuration** (package.json):
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

**Debugging Configuration** (`.vscode/launch.json`):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    }
  ]
}
```

**Initial Code Structure to Create**:
1. **src/App.tsx** - Main application component with routing
2. **src/main.tsx** - Application entry point
3. **src/components/index.ts** - Component barrel exports
4. **src/hooks/index.ts** - Custom hooks barrel exports
5. **src/utils/index.ts** - Utility functions barrel exports
6. **src/types/index.ts** - Type definitions barrel exports
7. **src/test/setup.ts** - Test environment setup
8. **src/__tests__/App.test.tsx** - Basic App component test

**Basic Test Setup** (src/test/setup.ts):
```typescript
import '@testing-library/jest-dom'
```

**Example Component Test** (src/__tests__/App.test.tsx):
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
```

## Development Workflow

**Recommended Scripts**:
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "vitest",
  "test:watch": "vitest --watch",
  "test:coverage": "vitest --coverage",
  "lint": "eslint src --ext ts,tsx",
  "lint:fix": "eslint src --ext ts,tsx --fix",
  "type-check": "tsc --noEmit"
}
```

## Override Guidelines

**Project-Specific Overrides**:
- Document overrides in PROJECT_DETAILS.md
- Maintain consistency within the project
- Justify deviations from these preferences

**Common Override Scenarios**:
- Different styling approach (e.g., styled-components)
- Additional state management (e.g., Redux)
- Specific testing requirements
- Custom build configurations

---

**Last Updated**: 2025-08-13
**Updated By**: AI (Initial Creation)
