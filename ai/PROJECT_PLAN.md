# Subnautica Map TODO List

## Phase 1: Basic Functionality ✅
- [x] Create POI data structure (name, type, x, y, notes)
- [x] Create basic HTML canvas element
- [x] Add POI to map with click
- [x] Display POIs as colored dots on canvas
- [x] Delete POI with right-click

## Phase 2: Map Interaction ✅
- [x] Pan map with mouse drag
- [x] Zoom in/out with mouse wheel
- [x] Responsive canvas that fills viewport
- [x] Styled Subnautica-themed UI
- [x] Reset view button

## Phase 3: POI UI ✅
- [x] Click on POI to bring up a details sidebar
- [x] Change delete from right click to a button in the details sidebar with confirmation dialog
- [x] Edit POI functionality in sidebar (name, type, depth, notes - coordinates read-only)
- [x] Styled edit and delete buttons consistently on same line
- [x] Custom confirmation dialog with terminal theme
- [x] Open a dialog (in details sidebar) when creating a new POI (and allow cancelling). Right-click to create POI with ADD sidebar mode.

## Phase 4: Bearing System ✅
- [x] Create foundational data types
- [x] Add bearing input form (compass direction + distance)
- [x] Calculate POI coordinates from bearing + reference point
- [x] Show bearing lines on map
- [x] Support multiple bearings for triangulation
- [x] Auto-generate bearings relative to Lifeboat 5 for new POIs
- [x] Remove fixed coordinates mode - all POIs use bearing-based positioning
- [x] Handle POI deletion with bearing cleanup and coordinate recalculation

## Phase 5: Map Management ✅
- [x] Multiple map support with localStorage persistence
- [x] Map switching functionality
- [x] Map renaming with real-time UI updates
- [x] Map deletion with confirmation dialogs
- [x] Default map creation ("Map 1")
- [x] Map management modal with terminal theme
- [x] Synchronization between modal and main view

## Phase 6: POI Storage ✅
- [x] Save POIs to localStorage per map
- [x] Load POIs from localStorage on startup
- [x] Export POI list as JSON
- [x] Import POI list from JSON

## Phase 7: POI Management
- [x] Edit POI name and notes (completed in sidebar)
- [ ] Filter POIs by type (wreck, resource, biome, etc.)
- [ ] Search POIs by name

## Phase 8: UI Polish (After Core Features Work)
- [ ] Subnautica-themed colors (blue/teal/orange)
- [x] Custom POI icons by type (emoji rendering implemented)
- [ ] Smooth animations for interactions
- [ ] Responsive design for mobile

## Audio (Optional)
- [ ] Background ambient ocean sounds
- [ ] Click/interaction sound effects
- [ ] Audio toggle button

## Follows
- [ ] Allow and undo and confirmationless delete

## Completed
- [x] Set up TypeScript + React + Vite project
- [x] Configure development environment
- [x] Create basic React app structure
