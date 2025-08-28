# Subnautica Map

Interactive mapping tool for Subnautica that maintains the game's atmospheric feel and immersion.

## Overview

Instead of traditional maps with lines or fog-of-war mechanics, this tool uses a coordinate-based system where players enter Points of Interest (POIs) based on bearings and distances from known locations, starting from Lifepod 5.

## Features

- **Bearing-based coordinate system**: Enter POIs using distance and bearing from existing points
- **Triangulation algorithm**: Automatically calculates coordinates from multiple bearing references
- **Immersive UI**: Maintains Subnautica's atmospheric design
- **Interactive 2D map**: Visual representation of discovered locations
- **POI management**: Add, edit, and categorize points of interest

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS with Subnautica-inspired theming
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Development

```bash
# Run linting
pnpm lint

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── data/               # Data management
├── styles/             # Global styles
└── __tests__/          # Test files
```

## Contributing

This project follows the AI_DEV framework for structured development. See the `/ai` folder for development guidelines and project documentation.

## License

See LICENSE file for details.
