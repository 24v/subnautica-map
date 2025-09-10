/**
 * Map storage service for managing POI maps in localStorage
 */

import { POI, POIMap, MapStorage, LIFEBOAT_5 } from '../types/poi';

const STORAGE_KEY = 'subnautica-maps';
const CURRENT_MAP_KEY = 'subnautica-current-map';

export class MapStorageService {
  /**
   * Get all storage data from localStorage
   */
  private getStorageData(): MapStorage {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return {
          maps: {},
          currentMapId: null,
          lastViewedMapId: null
        };
      }
      
      const parsed = JSON.parse(data);
      
      // Convert date strings back to Date objects
      Object.values(parsed.maps).forEach((map: any) => {
        map.createdAt = new Date(map.createdAt);
        map.updatedAt = new Date(map.updatedAt);
        map.pois.forEach((poi: any) => {
          poi.createdAt = new Date(poi.createdAt);
          poi.updatedAt = new Date(poi.updatedAt);
          if (poi.bearingRecords) {
            poi.bearingRecords.forEach((bearing: any) => {
              bearing.createdAt = new Date(bearing.createdAt);
            });
          }
        });
      });
      
      return parsed;
    } catch (error) {
      console.error('Error loading map storage:', error);
      return {
        maps: {},
        currentMapId: null,
        lastViewedMapId: null
      };
    }
  }

  /**
   * Save storage data to localStorage
   */
  private saveStorageData(data: MapStorage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving map storage:', error);
    }
  }

  /**
   * Create a new map with default POI (Lifeboat 5)
   */
  createMap(name: string): POIMap {
    const mapId = `map-${Date.now()}`;
    const now = new Date();
    
    const newMap: POIMap = {
      id: mapId,
      name,
      pois: [LIFEBOAT_5],
      createdAt: now,
      updatedAt: now
    };

    const storage = this.getStorageData();
    storage.maps[mapId] = newMap;
    
    // Set as current map if no current map exists
    if (!storage.currentMapId) {
      storage.currentMapId = mapId;
      storage.lastViewedMapId = mapId;
    }
    
    this.saveStorageData(storage);
    return newMap;
  }

  /**
   * Get all available maps
   */
  getAllMaps(): POIMap[] {
    const storage = this.getStorageData();
    return Object.values(storage.maps).sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  /**
   * Get a specific map by ID
   */
  getMap(mapId: string): POIMap | null {
    const storage = this.getStorageData();
    return storage.maps[mapId] || null;
  }

  /**
   * Get the current active map
   */
  getCurrentMap(): POIMap | null {
    const storage = this.getStorageData();
    
    // If no current map, try to get the last viewed map
    if (!storage.currentMapId && storage.lastViewedMapId) {
      storage.currentMapId = storage.lastViewedMapId;
      this.saveStorageData(storage);
    }
    
    // If still no current map, create a default one
    if (!storage.currentMapId) {
      return this.createMap('Default Map');
    }
    
    return this.getMap(storage.currentMapId);
  }

  /**
   * Set the current active map
   */
  setCurrentMap(mapId: string): boolean {
    const storage = this.getStorageData();
    
    if (!storage.maps[mapId]) {
      return false;
    }
    
    storage.currentMapId = mapId;
    storage.lastViewedMapId = mapId;
    this.saveStorageData(storage);
    return true;
  }

  /**
   * Update POIs for a specific map
   */
  updateMapPOIs(mapId: string, pois: POI[]): boolean {
    const storage = this.getStorageData();
    const map = storage.maps[mapId];
    
    if (!map) {
      return false;
    }
    
    map.pois = pois;
    map.updatedAt = new Date();
    this.saveStorageData(storage);
    return true;
  }

  /**
   * Update map metadata (name, etc.)
   */
  updateMap(mapId: string, updates: Partial<Pick<POIMap, 'name'>>): boolean {
    const storage = this.getStorageData();
    const map = storage.maps[mapId];
    
    if (!map) {
      return false;
    }
    
    Object.assign(map, updates);
    map.updatedAt = new Date();
    this.saveStorageData(storage);
    return true;
  }

  /**
   * Delete a map
   */
  deleteMap(mapId: string): boolean {
    const storage = this.getStorageData();
    
    if (!storage.maps[mapId]) {
      return false;
    }
    
    delete storage.maps[mapId];
    
    // If deleting current map, switch to another map or create new one
    if (storage.currentMapId === mapId) {
      const remainingMaps = Object.keys(storage.maps);
      if (remainingMaps.length > 0) {
        storage.currentMapId = remainingMaps[0];
        storage.lastViewedMapId = remainingMaps[0];
      } else {
        storage.currentMapId = null;
        storage.lastViewedMapId = null;
      }
    }
    
    this.saveStorageData(storage);
    return true;
  }

  /**
   * Get current map ID
   */
  getCurrentMapId(): string | null {
    const storage = this.getStorageData();
    return storage.currentMapId;
  }

  /**
   * Check if storage has any maps
   */
  hasAnyMaps(): boolean {
    const storage = this.getStorageData();
    return Object.keys(storage.maps).length > 0;
  }

  /**
   * Initialize storage - create default map if none exist
   */
  initialize(): POIMap {
    if (!this.hasAnyMaps()) {
      return this.createMap('Default Map');
    }
    
    const currentMap = this.getCurrentMap();
    if (!currentMap) {
      return this.createMap('Default Map');
    }
    
    return currentMap;
  }
}

// Export singleton instance
export const mapStorage = new MapStorageService();
