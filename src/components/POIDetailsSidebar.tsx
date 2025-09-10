import { POI, POI_METADATA, POIType, BearingRecord, POIDefinitionMode } from '../types/poi';
import { useState } from 'react';

interface POIDetailsSidebarProps {
  poi: POI | null;
  onClose: () => void;
  onDelete: (poiId: string) => void;
  onUpdate: (poi: POI) => void;
  onSave: (poi: POI) => void;
  isProvisional?: boolean;
  coordinates?: {x: number, y: number} | null;
  allPOIs?: POI[]; // Available POIs for bearing references
}

export default function POIDetailsSidebar({ 
  poi, 
  onClose, 
  onDelete,
  onUpdate,
  onSave,
  isProvisional = false,
  coordinates = null,
  allPOIs = []
}: POIDetailsSidebarProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  // const [isEditing, setIsEditing] = useState(isProvisional); // Start in edit mode for provisional POIs
  
  const defaultPOI: POI = {
    id: `poi-${Date.now()}`,
    name: 'New POI',
    type: 'landmark' as POIType,
    x: coordinates?.x || 0,
    y: coordinates?.y || 0,
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    definitionMode: 'coordinates'
  };
  
  const [currentPOI, setCurrentPOI] = useState(poi || defaultPOI);
  const metadata = POI_METADATA[currentPOI.type];

  const handleDeleteClick = (e: React.MouseEvent) => {
    // TODO: Are these needed?
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(currentPOI.id);
    onClose();
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const handleSave = () => {
     onSave(currentPOI);
     onClose();
  }

  const handleUpdate = () => {
    onUpdate(currentPOI);
    onClose();
 }

  const handleFieldChange = (field: keyof POI, value: any) => {
    setCurrentPOI({
      ...currentPOI,
      [field]: value
    });
  };

  const handleModeChange = (mode: POIDefinitionMode) => {
    setCurrentPOI({
      ...currentPOI,
      definitionMode: mode,
      bearingRecords: mode === 'bearings' ? (currentPOI.bearingRecords || []) : undefined
    });
  };

  const handleAddBearing = () => {
    const newBearing: BearingRecord = {
      id: `bearing-${Date.now()}`,
      targetPOIId: allPOIs.length > 0 ? allPOIs[0].id : '',
      distance: 100,
      bearing: 0,
      createdAt: new Date()
    };

    setCurrentPOI({
      ...currentPOI,
      bearingRecords: [...(currentPOI.bearingRecords || []), newBearing]
    });
  };

  const handleRemoveBearing = (bearingId: string) => {
    setCurrentPOI({
      ...currentPOI,
      bearingRecords: (currentPOI.bearingRecords || []).filter(b => b.id !== bearingId)
    });
  };

  const handleBearingChange = (bearingId: string, field: keyof BearingRecord, value: any) => {
    setCurrentPOI({
      ...currentPOI,
      bearingRecords: (currentPOI.bearingRecords || []).map(bearing =>
        bearing.id === bearingId ? { ...bearing, [field]: value } : bearing
      )
    });
  };

  // Filter available POIs to exclude the current POI for bearing references
  const availablePOIs = allPOIs.filter(p => p.id !== currentPOI.id);

  return (
    <div className="poi-details-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">
          <span className="poi-emoji">{metadata.emoji}</span>
          {currentPOI.name}
        </h3>
        <button 
          className="close-btn"
          onClick={onClose}
          title="Close details"
        >
          ×
        </button>
      </div>
      <div className="sidebar-content">
          <>
            <div className="poi-field">
              <label>Name</label>
              <input
                type="text"
                value={currentPOI.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="edit-input"
              />
            </div>

            <div className="poi-field">
              <label>Type</label>
              <select
                value={currentPOI.type}
                onChange={(e) => handleFieldChange('type', e.target.value as POIType)}
                className="edit-select"
              >
                {Object.entries(POI_METADATA).map(([type, meta]) => (
                  <option key={type} value={type}>
                    {meta.emoji} {meta.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="poi-field">
              <label>Position Mode</label>
              <div className="mode-toggle">
                <button
                  type="button"
                  className={`mode-btn ${currentPOI.definitionMode === 'coordinates' ? 'active' : ''}`}
                  onClick={() => handleModeChange('coordinates')}
                >
                  Fixed Coordinates
                </button>
                <button
                  type="button"
                  className={`mode-btn ${currentPOI.definitionMode === 'bearings' ? 'active' : ''}`}
                  onClick={() => handleModeChange('bearings')}
                  disabled={availablePOIs.length === 0}
                  title={availablePOIs.length === 0 ? 'Need other POIs for bearing references' : 'Position using bearings from other POIs'}
                >
                  Bearing-Based
                </button>
              </div>
            </div>

            {currentPOI.definitionMode === 'coordinates' ? (
              <div className="poi-field">
                <label>Coordinates (read-only)</label>
                <div className="coordinates">
                  X: {currentPOI.x.toFixed(1)}, Y: {currentPOI.y.toFixed(1)}
                </div>
              </div>
            ) : (
              <div className="poi-field">
                <label>Bearings</label>
                <div className="bearings-section">
                  {(currentPOI.bearingRecords || []).map((bearing) => (
                    <div key={bearing.id} className="bearing-entry">
                      <div className="bearing-controls">
                        <select
                          value={bearing.targetPOIId}
                          onChange={(e) => handleBearingChange(bearing.id, 'targetPOIId', e.target.value)}
                          className="bearing-select"
                        >
                          <option value="">Select reference POI</option>
                          {availablePOIs.map(poi => (
                            <option key={poi.id} value={poi.id}>
                              {poi.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Distance (m)"
                          value={bearing.distance}
                          onChange={(e) => handleBearingChange(bearing.id, 'distance', parseFloat(e.target.value) || 0)}
                          className="bearing-input"
                          min="0"
                        />
                        <input
                          type="number"
                          placeholder="Bearing (°)"
                          value={bearing.bearing}
                          onChange={(e) => handleBearingChange(bearing.id, 'bearing', parseInt(e.target.value) || 0)}
                          className="bearing-input"
                          min="0"
                          max="359"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBearing(bearing.id)}
                          className="remove-bearing-btn"
                          title="Remove bearing"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddBearing}
                    className="add-bearing-btn"
                    disabled={availablePOIs.length === 0}
                  >
                    + Add Bearing
                  </button>
                  {currentPOI.bearingRecords && currentPOI.bearingRecords.length > 0 && (
                    <div className="calculated-coordinates">
                      <small>Calculated position: X: {currentPOI.x.toFixed(1)}, Y: {currentPOI.y.toFixed(1)}</small>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="poi-field">
              <label>Depth (m)</label>
              <input
                type="number"
                value={currentPOI.depth || ''}
                onChange={(e) => handleFieldChange('depth', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="edit-input"
                placeholder="Optional"
              />
            </div>

            <div className="poi-field">
              <label>Notes</label>
              <textarea
                value={currentPOI.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                className="edit-textarea"
                placeholder="Add notes..."
                rows={3}
              />
            </div>
            {currentPOI.createdAt && (
              <div className="poi-field">
                <label>Created</label>
                <p className="poi-timestamp">Created: {currentPOI.createdAt.toLocaleDateString()}</p>
              </div>
            )}
          </>
      </div>

      <div className="sidebar-actions">
        {!isProvisional ? (
          <>
            <button 
              className="save-btn"
              onClick={handleUpdate}
              title="Update a POI"
            >
              Update
            </button>
            <button 
              className="cancel-btn"
              onClick={onClose}
              title="Cancel editing"
            >
              Cancel
            </button>
            <button 
              className="delete-btn"
              onClick={handleDeleteClick}
              title="Delete POI"
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button 
              className="save-btn"
              onClick={handleSave}
              title="Create a new POI"
            >
              Create
            </button>
            <button 
              className="cancel-btn"
              onClick={onClose}
              title="Cancel POI creation"
            >
              ❌ Cancel
            </button>
          </>
        )}
      </div>

      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Confirm Delete</h3>
            <p><strong>Name:</strong> {currentPOI.name}</p>
            <p>This action cannot be undone.</p>
            <div className="confirm-dialog-actions">
              <button 
                className="confirm-btn"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
              <button 
                className="cancel-btn"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
