# Project Details

**Purpose**: This file contains comprehensive project information filled out by the user and AI collaboratively as the project evolves. It serves as the single source of truth for project setup, technology choices, architecture, and development workflows.

**Instructions**: Fill out the initial sections below. The AI will update and expand this file during bootstrap and ongoing development.


## Project Overview

**Project Name**: 
Subnautica Map

**Short Description**: 
Mapping for subnautica that maintains flavor of the game

**Detailed Description**: 
Instead of creating or adding a map with lines, or using a typical map with fog of war that is revealed during exploration, this one will be based around the user entering coordinates. 

As the player is playing the game, they will discover or create notable places. For example the name and locations of wrecks, resources, buoy, points of interest, changes in biome, caves etc. We call these Points of Interest (POI)

Subnautica does not have a coordinate system visible to the user. Instead it only has references to other artifacts based on distance. Everything will be based on the players starting location (lifeboat 5).

The user will add POI's to this tool, and we will make a visual 2d graph of them, which will be a map the user can reference.

Adding a new POI:
- The user will select one or more of the existing POIs
- They will specify the distance from or to the selected POI
- They will specify the bearing to the selected POI from or to the current position
- They will specify the name of the POI
- They will specify the type of the POI
- They will specify any additional notes

Then the system will:
- Record that information
- Use the bearings to generate a coordinate for the POI using an internal coordinate system based around lifeboat 5.
- It will use the x,y coordinates for graphing the POIs for the user

Coordinate system:
- The user will NEVER tell the system the x,y coordinates (except in a debug mode). Those must be calculated from bearings.

Translation from bearings to coordinates:
- There are multiple bearings from one point to other, and those to others. Not all bearings to all points by the user will need to be entered.
- The system will remember the original bearing information that the user enters.
- The user can enter multiple bearings for each new POI, and can add addtional bearings to existing POIs.
- The system will need translate the bearings into coordinates. It will serialize the coordinates.
- The bearing entries are not exact and will definitely diverge
- The system will translate bearing and coorinates for each POI trying to minimize the errors between all the bearings and the coordinates.
- When a new POI is entered, the system will try to optimize the coordinates for JUST THAT POI.
- There will be an additional function the user can choose to re-calculate coordinates for ALL

**POI Types:**
- 🚢 Wrecks (Aurora sections, other crashed ships)
- 🏭 Structures (Bases, Degasi habitats, Precursor facilities)  
- 🌊 Biome Boundaries (Safe Shallows, Kelp Forest, Dunes, etc.)
- 💎 Resource Nodes (Metal salvage, limestone, sandstone outcrops)
- 🕳️ Cave Entrances (Lost River, Lava Zone access points)
- 🎯 Landmarks (Floating Island, Mountain Island, Aurora)
- ⚠️ Hazards (Reaper spawns, dangerous areas)
- 🔧 Player Bases (Custom built structures)
- 📍 Buoy (Custom navigation markers)

**User Stories**:

**As a Subnautica player, I want to:**

1. Create new POIs
- Specify reference POIs and the bearings and distance to those POI's
- Specify the depth
- Specify the type of POI
- Specify the name of the POI
- The system will record the new POI as well as calculating its coordinates from the bearing(s)

2. View POI's on a graph
- Based on a coordinate system around lifeboat 5
- Different images based on types (we can use emojis for now)

3. View and Edit existing POI details
- View and edit the fields of the POI.

4. Explicitly choose to re-calculate all coordinates for POI's based on ALL recorded bearings. Trying to minimize error / conflicts.

5. Zoom in and out in graph to get context

6. See previous maps, that have persisted across browser refreshes.
Have the ability to save or work on mulitiple different maps

7. Import / Export the coordinates to a file which can then be imported as a new map

8. Feel immersed in the game with UI that fits aesthetic

**Project Type**: 
SPA react web app

## Technology Stack

**Primary Language**: 
TypeScript

**Framework/Platform**: 
Vite + React

**Database**: 
Local Storage / IndexedDB (client-side data persistence)

**Additional Technologies**: 
- React Context for coordinate and discovery state management
- CSS Modules for component styling with Subnautica theming
- Web Audio API for atmospheric underwater sounds
- Local Storage for discovered coordinates and user progress
- Form validation for coordinate input

## Development Environment

**Package Manager**: 
pnpm (faster, more efficient than npm)

**Build Tool**: 
Vite

**Testing Framework**: 
Vitest + React Testing Library

**Code Style/Linting**: 
ESLint + Prettier + TypeScript strict mode

## Architecture & Design

**Architecture Pattern**: 
Component-based SPA with bearing-based triangulation and 2D map visualization

**Key Design Decisions**: 
- Bearing-based triangulation system using Lifeboat 5 as origin point
- Real-time coordinate optimization algorithms to minimize bearing errors
- Client-side only architecture (no backend required)
- Immersive UI design matching Subnautica's underwater aesthetic
- Local data persistence for POI data, bearings, and multiple map saves
- Canvas/SVG-based 2D map rendering with zoom and pan capabilities
- Mathematical optimization for coordinate calculation from multiple bearings
- Atmospheric audio integration for enhanced immersion
- Responsive design for desktop and tablet use

**External Dependencies**: 
- **APIs/Services**: 
  None (fully client-side application)
- **Third-party Libraries**: 
  React, React DOM, Form validation libraries, Web Audio API utilities

## Development Workflows

### How to Edit the Project
1. Clone/navigate to project directory
2. Run `pnpm install` to install dependencies
3. Use VS Code with TypeScript and ESLint extensions
4. Install React DevTools browser extension
5. Follow AI_DEV framework guidelines for making changes

### How to Run the Project
1. `pnpm dev` - Start development server
2. Open browser to `http://localhost:5173`
3. `pnpm build` - Build for production
4. `pnpm preview` - Preview production build

### How to Test the Project
1. `pnpm test` - Run all tests with Vitest
2. `pnpm test:watch` - Run tests in watch mode
3. `pnpm test:coverage` - Run tests with coverage report
4. Tests located in `src/__tests__/` directory
5. Focus on component rendering, bearing input validation, and triangulation algorithms

### How to Debug
1. Use browser DevTools for frontend debugging
2. Form validation and coordinate processing debugging
3. VS Code debugger configuration for TypeScript
4. Console logging for development
5. React DevTools for component state inspection
6. Local Storage inspection for coordinate persistence

## Deployment

**Target Platform**: 
Vercel or Netlify (static hosting for SPA)

**Environment Requirements**: 
Node.js 18+ for build process (Bun also supported), modern browser with Local Storage support

**Deployment Process**: 
1. `pnpm build` to create production build
2. Deploy `dist/` folder to static hosting
3. Configure SPA routing if needed
4. Ensure audio assets and coordinate data files are properly served

## Bootstrap Configuration

**Scaffolding Tool**: 
Vite with TypeScript React template (`pnpm create vite@latest subnautica-map --template react-ts`)

**Initial Dependencies**: 
- Core: react-router-dom (for navigation)
- Canvas/Graphics: konva, react-konva (for 2D map rendering)
- Math: lodash (for coordinate calculations)
- Testing: @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, vitest, jsdom
- Development: @types/node, eslint, prettier, typescript

- Not right away - Audio: howler (for atmospheric audio)

**Git Hooks**: 
- Optional: husky + lint-staged for pre-commit code quality checks

**Environment Variables**: 
- None required (fully client-side application)
- Optional: VITE_APP_VERSION for build info display

**Configuration Files Required**: 
- tsconfig.json (with strict mode and path aliases)
- eslint.config.js (React + TypeScript rules)
- .prettierrc (consistent formatting)
- vitest.config.ts (testing setup with jsdom)
- .vscode/settings.json (editor configuration)
- .vscode/extensions.json (recommended VS Code extensions)
- .vscode/launch.json (debugging configuration for Chrome)

**Directory Structure**: 
```
src/
├── components/
│   ├── map/              # Map rendering components
│   ├── forms/            # Coordinate input forms
│   ├── ui/               # Reusable UI components
│   └── audio/            # Audio management components
├── hooks/                # Custom hooks for triangulation, audio
├── utils/
│   ├── triangulation.ts  # Bearing-based coordinate algorithms
│   ├── coordinates.ts    # Coordinate conversion utilities
│   └── audio.ts          # Audio management utilities
├── types/
│   ├── coordinates.ts    # Coordinate and POI type definitions
│   └── game.ts           # Game-specific types
├── data/
│   ├── pois.ts           # Point of Interest definitions
│   └── audio/            # Audio asset references
├── styles/               # Global styles and themes
└── __tests__/            # Test files
```

**Initial Code Setup**: 
- Main App component with routing (Home, Map, Settings)
- CoordinateInput form component with bearing validation
- MapCanvas component for 2D visualization
- TriangulationEngine utility for coordinate calculations
- POI management system with emoji categorization
- Audio manager for atmospheric sounds
- Local Storage persistence layer
- Basic test files and examples (App.test.tsx, setup.ts)

**Development Scripts**: 
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

## Template & Policy Overrides

### Template Overrides
- **Component Templates**: Focus on immersive, game-themed UI components with dark ocean aesthetics
- **Form Templates**: Specialized coordinate input forms with bearing validation and visual feedback
- **Canvas Templates**: 2D map rendering components with zoom, pan, and POI overlay capabilities
- **Audio Templates**: Atmospheric audio management with ambient ocean sounds and UI feedback

### Technology Preference Overrides
- **Canvas Library**: Use Konva.js instead of vanilla Canvas API for better React integration and performance
- **Audio Library**: Use Howler.js for cross-browser audio compatibility and spatial audio features
- **Math Library**: Include Lodash for coordinate calculation utilities and data manipulation
- **Styling**: Emphasize dark, oceanic color schemes with bioluminescent accents to match Subnautica aesthetic
- **State Management**: Client-side only with Local Storage persistence (no external databases)

### Testing Policy Overrides
- **Algorithm Testing**: Extensive unit tests for triangulation algorithms and coordinate calculations
- **Canvas Testing**: Mock Konva components for rendering tests without actual canvas rendering
- **Audio Testing**: Mock Howler.js for audio functionality without actual sound playback
- **Form Validation**: Comprehensive testing of bearing input validation and coordinate format handling
- **Local Storage**: Test data persistence and retrieval scenarios

---

### Current Architecture
[AI will document the actual implemented architecture here]

### Key Implementation Details
[AI will document important implementation decisions and patterns used]

---

## AI Development Notes
*This section is maintained by the AI during development*

**Last Updated**: 2025-08-13
**Updated By**: AI (Initialization Complete)