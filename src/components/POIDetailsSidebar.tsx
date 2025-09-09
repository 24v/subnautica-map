import { POI, POI_METADATA } from '../types/poi';
import { useState } from 'react';

interface POIDetailsSidebarProps {
  poi: POI | null;
  onClose: () => void;
  onDelete?: (poiId: string) => void;
}

export default function POIDetailsSidebar({ 
  poi, 
  onClose, 
  onDelete 
}: POIDetailsSidebarProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
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
      </div>

      <div className="sidebar-actions">
        <button 
          className="delete-btn"
          onClick={handleDeleteClick}
          title="Delete this POI"
        >
          🗑️ Delete POI
        </button>
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
