import { POI, POI_METADATA } from '../types/poi';

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
  if (!poi) return null;

  const metadata = POI_METADATA[poi.type];

  const handleDelete = () => {
    if (onDelete && confirm(`Delete POI "${poi.name}"?`)) {
      onDelete(poi.id);
      onClose();
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
          onClick={handleDelete}
          title="Delete this POI"
        >
          🗑️ Delete POI
        </button>
      </div>
    </div>
  );
}
