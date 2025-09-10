/**
 * Point of Interest (POI) types and data structures for Subnautica Map
 */

// Map storage types
export interface POIMap {
  id: string;
  name: string;
  pois: POI[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MapStorage {
  maps: Record<string, POIMap>;
  currentMapId: string | null;
  lastViewedMapId: string | null;
}

export type POIType = 
  | 'wreck'
  | 'structure'
  | 'resource'
  | 'biome'
  | 'landmark'
  | 'hazard'
  | 'base'
  | 'buoy'
  | 'lifeboat'
  | 'cave';

export type POIDefinitionMode = 'coordinates' | 'bearings';

export type BearingDirection = 'to' | 'from';

export interface BearingRecord {
  id: string;
  referencePOIId: string; // The POI this bearing references
  distance: number; // Distance in meters
  bearing: number; // Compass bearing in degrees (0-359, where 0 = North)
  direction: BearingDirection; // 'to' = bearing TO reference POI, 'from' = bearing FROM reference POI
  createdAt: Date;
}

export interface POI {
  id: string;
  name: string;
  type: POIType;
  x: number; // Display coordinates (calculated from bearings if mode is 'bearings')
  y: number; // Display coordinates (calculated from bearings if mode is 'bearings')
  notes?: string;
  depth: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Bearing system fields
  definitionMode: POIDefinitionMode;
  bearingRecords?: BearingRecord[]; // Only used when definitionMode is 'bearings'
}

// POI type metadata for UI display
export const POI_METADATA: Record<POIType, { emoji: string; color: string; label: string }> = {
  wreck: { emoji: '🚢', color: '#ff6b35', label: 'Wreck' },
  structure: { emoji: '🏭', color: '#4ecdc4', label: 'Structure' },
  biome: { emoji: '🌊', color: '#45b7d1', label: 'Biome' },
  resource: { emoji: '💎', color: '#96ceb4', label: 'Resource' },
  lifeboat: { emoji: '⭐', color: '#ffd700', label: 'Lifeboat' },
  landmark: { emoji: '🎯', color: '#f9ca24', label: 'Landmark' },
  hazard: { emoji: '⚠️', color: '#f0932b', label: 'Hazard' },
  base: { emoji: '🔧', color: '#6c5ce7', label: 'Player Base' },
  buoy: { emoji: '📍', color: '#a29bfe', label: 'Buoy' },
  cave: { emoji: '🕳️', color: '#786fa6', label: 'Cave' }
};

// Default POI for Lifeboat 5 (origin point)
export const LIFEBOAT_5: POI = {
  id: 'lifeboat-5',
  name: 'Lifeboat 5',
  type: 'lifeboat',
  x: 0,
  y: 0,
  notes: 'Starting location - coordinate system origin',
  depth: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  definitionMode: 'coordinates'
};
