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
- [ ] Open a dialog (in details sidebar) when creating a new POI (and allow cancelling). For now, just using absolute positioning.

## Phase 4: Bearing System
- [ ] Add bearing input form (compass direction + distance)
- [ ] Calculate POI coordinates from bearing + reference point
- [ ] Show bearing lines on map
- [ ] Support multiple bearings for triangulation

## Phase 5: POI Management
- [ ] Edit POI name and notes
- [ ] Filter POIs by type (wreck, resource, biome, etc.)
- [ ] Search POIs by name
- [ ] Save POIs to localStorage
- [ ] Load POIs from localStorage on startup
- [ ] Export POI list as JSON
- [ ] Import POI list from JSON

## Phase 6: UI Polish (After Core Features Work)
- [ ] Subnautica-themed colors (blue/teal/orange)
- [ ] Custom POI icons by type
- [ ] Smooth animations for interactions
- [ ] Responsive design for mobile

## Audio (Optional)
- [ ] Background ambient ocean sounds
- [ ] Click/interaction sound effects
- [ ] Audio toggle button

## Completed
- [x] Set up TypeScript + React + Vite project
- [x] Configure development environment
- [x] Create basic React app structure
