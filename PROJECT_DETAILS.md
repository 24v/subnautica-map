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

Translation from bearings to coordinates:
- There are multiple bearings from one point to other, and those to others. Not all bearings to all points by the user will need to be entered.
- The system will remember the original bearing information that the user enters.
- The user can enter multiple bearings for each new POI, and can add addtional bearings to existing POIs.
- The system will need translate the bearings into coordinates. It will serialize the coordinates.
- The bearing entries are not exact and will definitely diverge
- The system will translate bearing and coorinates for each POI trying to minimize the errors between all the bearings and the coordinates.
- When a new POI is entered, the system will try to optimize the coordinates for JUST THAT POI.
- There will be an additional function the user can choose to re-calculate coordinates for ALL

**User Stories**:
[Describe usecases in detail]

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
- Canvas/WebGL for interactive map rendering
- React Context for state management
- CSS Modules for component styling
- Web Audio API for atmospheric sounds
- Local Storage for user data persistence

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
Component-based SPA with Canvas/WebGL rendering layer

**Key Design Decisions**: 
- Canvas/WebGL for high-performance interactive map rendering
- Client-side only architecture (no backend required)
- Immersive UI design matching Subnautica's aesthetic
- Local data persistence for user progress and markers
- Atmospheric audio integration for enhanced immersion
- Responsive design for desktop and tablet use

**External Dependencies**: 
- **APIs/Services**: 
  None (fully client-side application)
- **Third-party Libraries**: 
  React, React DOM, Canvas/WebGL libraries, Web Audio API utilities

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
5. Focus on component rendering and map interaction logic

### How to Debug
1. Use browser DevTools for frontend debugging
2. Canvas/WebGL debugging with browser graphics tools
3. VS Code debugger configuration for TypeScript
4. Console logging for development
5. React DevTools for component state inspection

## Deployment

**Target Platform**: 
Vercel or Netlify (static hosting for SPA)

**Environment Requirements**: 
Node.js 18+ for build process (Bun also supported), modern browser with Canvas/WebGL support

**Deployment Process**: 
1. `pnpm build` to create production build
2. Deploy `dist/` folder to static hosting
3. Configure SPA routing if needed
4. Ensure Canvas/WebGL assets are properly served

## Template & Policy Overrides

### Template Overrides
[Any modifications to default templates used during code generation]

### Technology Preference Overrides
[Any overrides to default technology choices or configurations]

### Testing Policy Overrides
[Any project-specific testing requirements that differ from defaults]

---

## AI Development Notes
*This section is maintained by the AI during development*

### Bootstrap Status
- [ ] Initial project structure created
- [ ] Dependencies configured
- [ ] Testing framework set up
- [ ] Development environment configured

### Current Architecture
[AI will document the actual implemented architecture here]

### Key Implementation Details
[AI will document important implementation decisions and patterns used]

---

**Last Updated**: 2025-08-13
**Updated By**: AI (Initialization)
