/**
 * Map management modal for switching, renaming, and deleting maps
 */

import { useState, useEffect } from 'react';
import { POIMap } from '../types/poi';
import { mapStorage } from '../services/mapStorage';

interface MapManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMapId: string | null;
  onMapSwitch: (mapId: string) => void;
  onMapUpdate?: (mapId: string) => void;
}

export default function MapManager({ isOpen, onClose, currentMapId, onMapSwitch, onMapUpdate }: MapManagerProps) {
  const [maps, setMaps] = useState<POIMap[]>([]);
  const [editingMapId, setEditingMapId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Load maps when modal opens
  useEffect(() => {
    if (isOpen) {
      const allMaps = mapStorage.getAllMaps();
      setMaps(allMaps);
    }
  }, [isOpen]);

  const handleCreateMap = () => {
    const newMap = mapStorage.createMap(`Map ${maps.length + 1}`);
    setMaps(mapStorage.getAllMaps());
    onMapSwitch(newMap.id);
  };

  const handleStartEdit = (map: POIMap) => {
    setEditingMapId(map.id);
    setEditingName(map.name);
  };

  const handleSaveEdit = () => {
    if (editingMapId && editingName.trim()) {
      console.log('Saving map edit - mapId:', editingMapId, 'newName:', editingName.trim(), 'currentMapId:', currentMapId);
      mapStorage.updateMap(editingMapId, { name: editingName.trim() });
      setMaps(mapStorage.getAllMaps());
      
      // Notify parent if this is the current map
      if (editingMapId === currentMapId) {
        console.log('Calling onMapUpdate for current map');
        onMapUpdate?.(editingMapId);
      }
      
      setEditingMapId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMapId(null);
    setEditingName('');
  };

  const handleConfirmDelete = () => {
    if (showDeleteConfirm) {
      mapStorage.deleteMap(showDeleteConfirm);
      setMaps(mapStorage.getAllMaps());
      
      // If we deleted the current map, switch to another one
      if (showDeleteConfirm === currentMapId) {
        const remainingMaps = mapStorage.getAllMaps();
        if (remainingMaps.length > 0) {
          onMapSwitch(remainingMaps[0].id);
        }
      }
      
      setShowDeleteConfirm(null);
    }
  };

  const handleExportMap = (mapId: string) => {
    const exportData = mapStorage.exportMap(mapId);
    if (exportData) {
      const map = mapStorage.getMap(mapId);
      const fileName = `${map?.name || 'map'}-export.json`;
      
      // Create and trigger download
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleImportMap = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const importedMap = mapStorage.importMap(content);
        if (importedMap) {
          setMaps(mapStorage.getAllMaps());
          setImportError(null);
          // Switch to the imported map
          onMapSwitch(importedMap.id);
        } else {
          setImportError('Failed to import map. Please check the file format.');
        }
      }
      // Reset the input
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleMapSwitch = (mapId: string) => {
    mapStorage.setCurrentMap(mapId);
    onMapSwitch(mapId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content map-manager" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Map Manager</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="map-actions">
            <button className="create-map-btn" onClick={handleCreateMap}>
              + Create New Map
            </button>
            <div className="import-export-actions">
              <input
                type="file"
                accept=".json"
                onChange={handleImportMap}
                style={{ display: 'none' }}
                id="import-file-input"
              />
              <button 
                className="import-map-btn"
                onClick={() => document.getElementById('import-file-input')?.click()}
              >
                📁 Import Map
              </button>
            </div>
          </div>

          {importError && (
            <div className="import-error">
              {importError}
            </div>
          )}

          <div className="maps-list">
            {maps.map((map) => (
              <div 
                key={map.id} 
                className={`map-item ${map.id === currentMapId ? 'current' : ''}`}
                onClick={(e) => {
                  // Don't switch maps if clicking on edit/delete buttons or input fields
                  if (editingMapId === map.id || 
                      (e.target as HTMLElement).closest('.map-actions') ||
                      (e.target as HTMLElement).tagName === 'INPUT' ||
                      (e.target as HTMLElement).tagName === 'BUTTON') {
                    return;
                  }
                  handleMapSwitch(map.id);
                }}
                style={{ cursor: editingMapId === map.id ? 'default' : 'pointer' }}
              >
                <div className="map-info">
                  {editingMapId === map.id ? (
                    <div className="edit-name">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button onClick={handleSaveEdit}>✓</button>
                        <button onClick={handleCancelEdit}>×</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="map-name">
                        {map.name}
                        {map.id === currentMapId && <span className="current-indicator"> (current)</span>}
                      </div>
                      <div className="map-meta">
                        {map.pois.length} POIs • Updated {map.updatedAt.toLocaleDateString()}
                      </div>
                    </>
                  )}
                </div>

                <div className="map-actions">
                  {editingMapId !== map.id && (
                    <>
                      <button 
                        className="export-btn"
                        onClick={() => handleExportMap(map.id)}
                        title="Export map"
                      >
                        📤
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => handleStartEdit(map)}
                        title="Rename map"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => setShowDeleteConfirm(map.id)}
                        title="Delete map"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-dialog">
              <h3>Delete Map</h3>
              <p>Are you sure you want to delete this map? This action cannot be undone.</p>
              <div className="delete-confirm-actions">
                <button 
                  className="confirm-delete-btn"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
                <button 
                  className="cancel-delete-btn"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
