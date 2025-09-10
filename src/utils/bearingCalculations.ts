/**
 * Bearing calculation utilities for POI positioning system
 */

import { POI, BearingRecord, BearingDirection } from '../types/poi'

/**
 * Calculate bearing and distance from one point to another
 * @param fromX X coordinate of starting point
 * @param fromY Y coordinate of starting point
 * @param toX X coordinate of target point
 * @param toY Y coordinate of target point
 * @returns Object with bearing (0-359 degrees) and distance
 */
export function calculateBearingAndDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): { bearing: number; distance: number } {
  const deltaX = toX - fromX
  const deltaY = toY - fromY

  // Calculate distance
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  // Calculate bearing FROM target TO starting point (reverse direction for navigation)
  // This gives us the bearing you'd need to travel from the POI to reach the reference point
  let bearing = Math.atan2(-deltaX, deltaY) * (180 / Math.PI)

  // Normalize to 0-359 degrees
  if (bearing < 0) {
    bearing += 360
  }

  return { bearing: Math.round(bearing), distance: Math.round(distance) }
}

/**
 * Convert bearing (compass degrees) and distance to x,y offset
 * @param bearing Compass bearing in degrees (0 = North, 90 = East, 180 = South, 270 = West)
 * @param distance Distance in meters
 * @returns Object with x and y offsets
 */
export function bearingToOffset(
  bearing: number,
  distance: number,
  direction: BearingDirection = 'to'
): { x: number; y: number } {
  // Convert compass bearing to mathematical angle (0° = East, counterclockwise)
  // Compass: 0° = North, 90° = East, 180° = South, 270° = West
  // Math: 0° = East, 90° = North, 180° = West, 270° = South
  let adjustedBearing = bearing
  
  // If direction is 'to', we need to reverse the bearing (add 180°) to get the offset FROM reference TO POI
  // If direction is 'from', use bearing as-is since it already represents the direction FROM reference TO POI
  if (direction === 'to') {
    adjustedBearing = (bearing + 180) % 360
  }
  
  const mathAngle = (90 - adjustedBearing) * (Math.PI / 180)

  return {
    x: Math.cos(mathAngle) * distance,
    y: -Math.sin(mathAngle) * distance, // Negative because canvas Y increases downward
  }
}

/**
 * Calculate POI coordinates from bearing records using triangulation
 * If only one bearing record exists, uses that single reference point
 * If multiple bearing records exist, uses triangulation to find the best fit position
 * @param bearingRecords Array of bearing records for this POI
 * @param allPOIs Array of all POIs to find reference points
 * @returns Calculated x,y coordinates
 */
export function calculatePOICoordinates(
  bearingRecords: BearingRecord[],
  allPOIs: POI[]
): { x: number; y: number } {
  if (bearingRecords.length === 0) {
    throw new Error('Cannot calculate coordinates without bearing records')
  }

  // Create a map for quick POI lookup
  const poiMap = new Map(allPOIs.map((poi) => [poi.id, poi]))

  if (bearingRecords.length === 1) {
    // Single bearing - simple calculation
    const record = bearingRecords[0]
    const targetPOI = poiMap.get(record.referencePOIId)

    if (!targetPOI) {
      throw new Error(`Target POI ${record.referencePOIId} not found`)
    }

    const offset = bearingToOffset(record.bearing, record.distance, record.direction)
    return {
      x: targetPOI.x + offset.x,
      y: targetPOI.y + offset.y,
    }
  }

  // Multiple bearings - use triangulation
  return triangulatePosition(bearingRecords, poiMap)
}

/**
 * Triangulate position from multiple bearing records
 * Uses least squares method to find best fit position
 */
function triangulatePosition(
  bearingRecords: BearingRecord[],
  poiMap: Map<string, POI>
): { x: number; y: number } {
  const positions: Array<{ x: number; y: number }> = []

  // Calculate position from each bearing record
  for (const record of bearingRecords) {
    const targetPOI = poiMap.get(record.referencePOIId)
    if (!targetPOI) {
      console.warn(
        `Target POI ${record.referencePOIId} not found, skipping bearing record`
      )
      continue
    }

    const offset = bearingToOffset(record.bearing, record.distance, record.direction)
    positions.push({
      x: targetPOI.x + offset.x,
      y: targetPOI.y + offset.y,
    })
  }

  if (positions.length === 0) {
    throw new Error('No valid bearing records found for triangulation')
  }

  // Calculate average position (simple triangulation)
  const avgX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length
  const avgY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length

  return { x: avgX, y: avgY }
}

/**
 * Recalculate coordinates for a POI based on its bearing records
 * @param poi POI to recalculate
 * @param allPOIs Array of all POIs for reference
 * @returns Updated POI with new coordinates
 */
export function recalculatePOICoordinates(poi: POI, allPOIs: POI[]): POI {
  if (
    poi.definitionMode !== 'bearings' ||
    !poi.bearingRecords ||
    poi.bearingRecords.length === 0
  ) {
    return poi // No recalculation needed
  }

  try {
    const newCoords = calculatePOICoordinates(poi.bearingRecords, allPOIs)
    return {
      ...poi,
      x: newCoords.x,
      y: newCoords.y,
      updatedAt: new Date(),
    }
  } catch (error) {
    console.error(`Failed to recalculate coordinates for POI ${poi.id}:`, error)
    return poi // Return original POI if calculation fails
  }
}

/**
 * Validate that all bearing records reference existing POIs
 * @param bearingRecords Array of bearing records to validate
 * @param allPOIs Array of all available POIs
 * @returns Array of validation errors (empty if all valid)
 */
export function validateBearingRecords(
  bearingRecords: BearingRecord[],
  allPOIs: POI[]
): string[] {
  const errors: string[] = []
  const poiIds = new Set(allPOIs.map((poi) => poi.id))

  for (const record of bearingRecords) {
    if (!poiIds.has(record.referencePOIId)) {
      errors.push(`Target POI ${record.referencePOIId} does not exist`)
    }

    if (record.distance <= 0) {
      errors.push(`Distance must be positive, got ${record.distance}`)
    }

    if (record.bearing < 0 || record.bearing >= 360) {
      errors.push(
        `Bearing must be between 0-359 degrees, got ${record.bearing}`
      )
    }
  }

  return errors
}
