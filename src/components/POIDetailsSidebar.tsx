import {
  POI,
  POI_METADATA,
  POIType,
  BearingRecord,
  POIDefinitionMode,
  BearingDirection,
} from '../types/poi'
import { useEffect, useState } from 'react'
import { CompassDial } from './ui/CompassDial'

interface POIDetailsSidebarProps {
  poi: POI | null
  onClose: () => void
  onDelete?: (poiId: string) => void
  onUpdate: (poi: POI) => void
  onSave: (poi: POI) => void
  isProvisional?: boolean
  coordinates?: { x: number; y: number } | null
  allPOIs?: POI[] // Available POIs for bearing references
}

export default function POIDetailsSidebar({
  poi,
  onClose,
  onDelete,
  onUpdate,
  onSave,
  isProvisional = false,
  coordinates = null,
  allPOIs = [],
}: POIDetailsSidebarProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
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
    definitionMode: 'coordinates',
  }

  const [currentPOI, setCurrentPOI] = useState(poi || defaultPOI)

  // Update currentPOI when poi prop changes (for POI switching)
  useEffect(() => {
    if (poi) {
      setCurrentPOI(poi)
    } else if (isProvisional && coordinates && allPOIs) {
      // Reset to default POI when creating new (poi is null and isProvisional is true)
      // Always create new POIs with bearing mode and auto-calculate bearing to nearest POI

      // Always use Lifeboat 5 as reference for new POIs
      const lifeboat5 = allPOIs.find((poi) => poi.id === 'lifeboat-5')

      // Create bearing record to Lifeboat 5 if it exists
      const bearingRecords: BearingRecord[] = []
      if (lifeboat5) {
        // Calculate bearing and distance from clicked position to Lifeboat 5 (TO direction)
        const deltaX = lifeboat5.x - coordinates.x
        const deltaY = lifeboat5.y - coordinates.y

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        let bearing = Math.atan2(deltaX, -deltaY) * (180 / Math.PI)

        // Normalize to 0-359 degrees
        if (bearing < 0) {
          bearing += 360
        }

        bearingRecords.push({
          id: `bearing-${Date.now()}`,
          referencePOIId: lifeboat5.id,
          distance: Math.round(distance),
          bearing: Math.round(bearing),
          direction: 'to' as BearingDirection,
          createdAt: new Date(),
        })
      }

      const newDefaultPOI = {
        id: `poi-${Date.now()}`,
        name: 'New POI',
        type: 'landmark' as POIType,
        x: coordinates.x,
        y: coordinates.y,
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        definitionMode: 'bearings' as POIDefinitionMode,
        bearingRecords,
      }
      setCurrentPOI(newDefaultPOI)
    }
  }, [poi, isProvisional, coordinates, allPOIs])

  // Check if this is Lifeboat 5 (read-only)
  const isLifeboat5 = currentPOI.id === 'lifeboat-5'
  const metadata = POI_METADATA[currentPOI.type]

  const handleDeleteClick = (e: React.MouseEvent) => {
    // TODO: Are these needed?
    e.preventDefault()
    e.stopPropagation()
    setShowConfirmDialog(true)
  }

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(currentPOI.id)
    }
    onClose()
    setShowConfirmDialog(false)
  }

  const handleCancelDelete = () => {
    setShowConfirmDialog(false)
  }

  const handleSave = () => {
    onSave(currentPOI)
    onClose()
  }

  const handleUpdate = () => {
    onUpdate(currentPOI)
    onClose()
  }

  const handleAddBearing = () => {
    const newBearing: BearingRecord = {
      id: `bearing-${Date.now()}`,
      referencePOIId: allPOIs.length > 0 ? allPOIs[0].id : '',
      distance: 100,
      bearing: 0,
      direction: 'to' as BearingDirection,
      createdAt: new Date(),
    }

    setCurrentPOI({
      ...currentPOI,
      bearingRecords: [...(currentPOI.bearingRecords || []), newBearing],
    })
  }

  const handleRemoveBearing = (bearingId: string) => {
    setCurrentPOI({
      ...currentPOI,
      bearingRecords: (currentPOI.bearingRecords || []).filter(
        (b) => b.id !== bearingId
      ),
    })
  }

  const handleBearingChange = (
    index: number,
    field: keyof BearingRecord,
    value: any
  ) => {
    setCurrentPOI({
      ...currentPOI,
      bearingRecords: (currentPOI.bearingRecords || []).map((bearing, i) =>
        i === index ? { ...bearing, [field]: value } : bearing
      ),
    })
  }

  // Filter available POIs to exclude the current POI for bearing references
  const availablePOIs = allPOIs.filter((p) => p.id !== currentPOI.id)

  return (
    <div className="poi-details-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">
          <span className="poi-emoji">{metadata.emoji}</span>
          {currentPOI.name}
        </h3>
        <button className="close-btn" onClick={onClose} title="Close details">
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
              onChange={(e) =>
                setCurrentPOI({ ...currentPOI, name: e.target.value })
              }
              placeholder="Enter POI name"
              disabled={isLifeboat5}
              readOnly={isLifeboat5}
            />
          </div>

          <div className="poi-field">
            <label>Type</label>
            <select
              value={currentPOI.type}
              onChange={(e) =>
                setCurrentPOI({
                  ...currentPOI,
                  type: e.target.value as POIType,
                })
              }
              disabled={isLifeboat5}
            >
              {Object.entries(POI_METADATA).map(([type, metadata]) => (
                <option key={type} value={type}>
                  {metadata.emoji} {metadata.label}
                </option>
              ))}
            </select>
          </div>

          {!isLifeboat5 && (
            <div className="poi-field">
              <label>Bearings</label>
              <div className="bearings-section">
                {(currentPOI.bearingRecords || []).map((bearing, index) => (
                  <div key={bearing.id} className="bearing-entry">
                    <div className="bearing-controls">
                      <div className="bearing-field">
                        <label>Reference POI & Direction</label>
                        <div className="bearing-reference-row">
                          <select
                            value={bearing.direction}
                            onChange={(e) =>
                              handleBearingChange(
                                index,
                                'direction',
                                e.target.value as BearingDirection
                              )
                            }
                            className="bearing-select bearing-direction-select"
                          >
                            <option value="to">TO</option>
                            <option value="from">FROM</option>
                          </select>
                          <select
                            value={bearing.referencePOIId}
                            onChange={(e) =>
                              handleBearingChange(
                                index,
                                'referencePOIId',
                                e.target.value
                              )
                            }
                            className="bearing-select bearing-poi-select"
                          >
                            <option value="">Select reference POI</option>
                            {availablePOIs.map((poi) => (
                              <option key={poi.id} value={poi.id}>
                                {poi.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="bearing-field">
                        <label>Distance (meters)</label>
                        <input
                          type="number"
                          placeholder="100"
                          value={bearing.distance === 0 ? '' : bearing.distance}
                          onChange={(e) =>
                            handleBearingChange(
                              index,
                              'distance',
                              e.target.value === ''
                                ? 0
                                : parseFloat(e.target.value)
                            )
                          }
                          className="bearing-input"
                          min="0"
                        />
                      </div>
                      <div className="bearing-field">
                        <div className="bearing-header">
                          <div className="bearing-label-section">
                            <label>Bearing</label>
                            <span className="bearing-display">
                              {bearing.bearing}°{' '}
                              {(() => {
                                const directions = [
                                  'N',
                                  'NE',
                                  'E',
                                  'SE',
                                  'S',
                                  'SW',
                                  'W',
                                  'NW',
                                ]
                                const angles = [
                                  0, 45, 90, 135, 180, 225, 270, 315,
                                ]
                                const dirIndex = angles.findIndex(
                                  (angle) =>
                                    Math.abs(angle - bearing.bearing) <= 22.5
                                )
                                return dirIndex >= 0 ? directions[dirIndex] : ''
                              })()}
                            </span>
                          </div>
                          <div className="bearing-actions">
                            <button
                              type="button"
                              onClick={() => handleRemoveBearing(bearing.id)}
                              className="remove-bearing-btn"
                              title="Remove bearing"
                            >
                              × Remove
                            </button>
                          </div>
                        </div>
                        <CompassDial
                          value={bearing.bearing}
                          onChange={(newBearing) =>
                            handleBearingChange(index, 'bearing', newBearing)
                          }
                          size={180}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bearing-actions">
                  <button
                    type="button"
                    onClick={handleAddBearing}
                    className="add-bearing-btn"
                    disabled={availablePOIs.length === 0}
                    title={
                      availablePOIs.length === 0
                        ? 'Need other POIs to add bearings'
                        : 'Add another bearing'
                    }
                  >
                    Add Bearing
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="poi-field">
            <label>Position</label>
            <div className="coordinates">
              X: {currentPOI.x.toFixed(1)}, Y: {currentPOI.y.toFixed(1)}
              {currentPOI.definitionMode === 'bearings' &&
                currentPOI.bearingRecords &&
                currentPOI.bearingRecords.length > 0 && (
                  <small> (calculated from bearings)</small>
                )}
            </div>
          </div>

          <div className="poi-field">
            <label>Depth (m)</label>
            <input
              type="number"
              value={currentPOI.depth}
              onChange={(e) =>
                setCurrentPOI({
                  ...currentPOI,
                  depth: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0"
              disabled={isLifeboat5}
              readOnly={isLifeboat5}
            />
          </div>

          <div className="poi-field">
            <label>Notes</label>
            <textarea
              value={currentPOI.notes}
              onChange={(e) =>
                setCurrentPOI({ ...currentPOI, notes: e.target.value })
              }
              placeholder="Additional notes about this POI"
              rows={3}
              disabled={isLifeboat5}
              readOnly={isLifeboat5}
            />
          </div>
          {currentPOI.createdAt && (
            <div className="poi-field">
              <label>Created</label>
              <p className="poi-timestamp">
                Created: {currentPOI.createdAt.toLocaleDateString()}
              </p>
            </div>
          )}
        </>
      </div>

      <div className="sidebar-actions">
        {!isLifeboat5 && (
          <>
            {!isProvisional ? (
              <>
                <button className="save-btn" onClick={handleUpdate}>
                  Update
                </button>
                {onDelete && (
                  <button className="delete-btn" onClick={handleDeleteClick}>
                    Delete
                  </button>
                )}
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
                  Cancel
                </button>
              </>
            )}
          </>
        )}
      </div>

      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Confirm Delete</h3>
            <p>
              <strong>Name:</strong> {currentPOI.name}
            </p>
            <p>This action cannot be undone.</p>
            <div className="confirm-dialog-actions">
              <button className="confirm-btn" onClick={handleConfirmDelete}>
                Delete
              </button>
              <button className="cancel-btn" onClick={handleCancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
