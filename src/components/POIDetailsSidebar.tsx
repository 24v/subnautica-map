import { POI, POI_METADATA, POIType } from '../types/poi';
import { useState } from 'react';

interface POIDetailsSidebarProps {
  poi: POI | null;
  onClose: () => void;
  onDelete?: (poiId: string) => void;
  onUpdate?: (poi: POI) => void;
}

export default function POIDetailsSidebar({ 
  poi, 
  onClose, 
  onDelete,
  onUpdate 
}: POIDetailsSidebarProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPOI, setEditedPOI] = useState<POI | null>(null);
  
  if (!poi) return null;

  const metadata = POI_METADATA[poi.type];

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onDelete) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(poi.id);
      onClose();
    }
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const handleEditClick = () => {
    setEditedPOI({ ...poi });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedPOI && onUpdate) {
      const updatedPOI = {
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
    if (editedPOI) {
      setEditedPOI({
        ...editedPOI,
        [field]: value
      });
    }
  };

  return (
    <div className="poi-details-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">
          <span className="poi-emoji">{metadata.emoji}</span>
          {poi.name}
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
                value={editedPOI.type}
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
                X: {poi.x.toFixed(1)}, Y: {poi.y.toFixed(1)}
              </div>
            </div>

            <div className="poi-field">
              <label>Depth (m)</label>
              <input
                type="number"
                value={editedPOI.depth || ''}
                onChange={(e) => handleFieldChange('depth', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="edit-input"
                placeholder="Optional"
              />
            </div>

            <div className="poi-field">
              <label>Notes</label>
              <textarea
                value={editedPOI.notes || ''}
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
                X: {poi.x.toFixed(1)}, Y: {poi.y.toFixed(1)}
              </div>
            </div>

            {poi.depth !== undefined && (
              <div className="poi-field">
                <label>Depth</label>
                <div>{poi.depth}m</div>
              </div>
            )}

            <div className="poi-field">
              <label>Notes</label>
              <div className="notes">
                {poi.notes || 'No notes'}
              </div>
            </div>

            <div className="poi-field">
              <label>Created</label>
              <div className="timestamp">
                {poi.createdAt.toLocaleDateString()} {poi.createdAt.toLocaleTimeString()}
              </div>
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
            <p>Delete POI "{poi.name}"?</p>
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
