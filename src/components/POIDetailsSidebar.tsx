import { POI, POI_METADATA, POIType } from '../types/poi';
import { useState } from 'react';

interface POIDetailsSidebarProps {
  poi: POI | null;
  onClose: () => void;
  onDelete?: (poiId: string) => void;
  onUpdate?: (poi: POI) => void;
  onSave?: (poi: POI) => void;
  isProvisional?: boolean;
  coordinates?: {x: number, y: number} | null;
}

export default function POIDetailsSidebar({ 
  poi, 
  onClose, 
  onDelete,
  onUpdate,
  onSave,
  isProvisional = false,
  coordinates = null
}: POIDetailsSidebarProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(isProvisional); // Start in edit mode for provisional POIs
  
  // Create default POI for ADD mode when poi is null but isProvisional is true
  const defaultPOI: POI = {
    id: `poi-${Date.now()}`,
    name: 'New POI',
    type: 'landmark' as POIType,
    x: coordinates?.x || 0,
    y: coordinates?.y || 0,
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const currentPOI = poi || (isProvisional ? defaultPOI : null);
  const [editedPOI, setEditedPOI] = useState<POI | null>(isProvisional ? currentPOI : null);
  
  if (!currentPOI) return null;

  const metadata = POI_METADATA[currentPOI.type];

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onDelete) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(currentPOI.id);
      onClose();
    }
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const handleEditClick = () => {
    setEditedPOI({ ...currentPOI });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedPOI && onUpdate) {
      const updatedPOI = {
        ...currentPOI,
        ...editedPOI,
        updatedAt: new Date()
      };
      onUpdate(updatedPOI);
      setIsEditing(false);
      setEditedPOI(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedPOI(null);
  };

  const handleFieldChange = (field: keyof POI, value: any) => {
    setEditedPOI({
      ...currentPOI,
      ...editedPOI,
      [field]: value
    });
  };

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
        {isEditing && editedPOI ? (
          <>
            <div className="poi-field">
              <label>Name</label>
              <input
                type="text"
                value={editedPOI.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="edit-input"
              />
            </div>

            <div className="poi-field">
              <label>Type</label>
              <select
                value={editedPOI?.type || currentPOI.type}
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
              <label>Coordinates (read-only)</label>
              <div className="coordinates">
                X: {currentPOI.x.toFixed(1)}, Y: {currentPOI.y.toFixed(1)}
              </div>
            </div>

            <div className="poi-field">
              <label>Depth (m)</label>
              <input
                type="number"
                value={editedPOI?.depth || currentPOI.depth || ''}
                onChange={(e) => handleFieldChange('depth', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="edit-input"
                placeholder="Optional"
              />
            </div>

            <div className="poi-field">
              <label>Notes</label>
              <textarea
                value={editedPOI?.notes || currentPOI.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                className="edit-textarea"
                placeholder="Add notes..."
                rows={3}
              />
            </div>
          </>
        ) : (
          <>
            <div className="poi-field">
              <label>Type</label>
              <div className="poi-type" style={{ color: metadata.color }}>
                {metadata.label}
              </div>
            </div>

            <div className="poi-field">
              <label>Coordinates</label>
              <div className="coordinates">
                X: {currentPOI.x.toFixed(1)}, Y: {currentPOI.y.toFixed(1)}
              </div>
            </div>

            {currentPOI.depth !== undefined && (
              <div className="poi-field">
                <label>Depth</label>
                {currentPOI.depth && <p><strong>Depth:</strong> {currentPOI.depth}m</p>}
              </div>
            )}

            <div className="poi-field">
              <label>Notes</label>
              <div className="notes">
                {currentPOI.notes && <p><strong>Notes:</strong> {currentPOI.notes}</p>}
              </div>
            </div>

            <div className="poi-field">
              <label>Created</label>
              <p className="poi-timestamp">Created: {currentPOI.createdAt.toLocaleDateString()}</p>
            </div>
          </>
        )}
      </div>

      <div className="sidebar-actions">
        {isEditing ? (
          <>
            <button 
              className="save-btn"
              onClick={handleSaveEdit}
              title="Save changes"
            >
              💾 Save
            </button>
            <button 
              className="cancel-btn"
              onClick={handleCancelEdit}
              title="Cancel editing"
            >
              ❌ Cancel
            </button>
          </>
        ) : isProvisional ? (
          <>
            <button 
              className="save-btn"
              onClick={() => {
                if (onSave) {
                  const poiToSave = editedPOI || currentPOI;
                  onSave(poiToSave);
                }
              }}
              title="Save new POI"
            >
              💾 Save POI
            </button>
            <button 
              className="cancel-btn"
              onClick={onClose}
              title="Cancel POI creation"
            >
              ❌ Cancel
            </button>
          </>
        ) : (
          <>
            <div className="action-buttons-row">
              {onUpdate && (
                <button 
                  className="edit-btn"
                  onClick={handleEditClick}
                  title="Edit this POI"
                >
                  Edit POI
                </button>
              )}
              {onDelete && (
                <button 
                  className="delete-btn"
                  onClick={handleDeleteClick}
                  title="Delete this POI"
                >
                  🗑️ Delete POI
                </button>
              )}
            </div>
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
