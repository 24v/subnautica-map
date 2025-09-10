import React, { useState, useRef, useEffect, useCallback } from 'react'

interface CompassDialProps {
  value: number // bearing in degrees (0-359)
  onChange: (bearing: number) => void
  size?: number
}

export const CompassDial: React.FC<CompassDialProps> = ({
  value,
  onChange,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const dialRef = useRef<SVGSVGElement>(null)

  // Cardinal and intercardinal directions
  const directions = [
    { label: 'N', angle: 0 },
    { label: 'NE', angle: 45 },
    { label: 'E', angle: 90 },
    { label: 'SE', angle: 135 },
    { label: 'S', angle: 180 },
    { label: 'SW', angle: 225 },
    { label: 'W', angle: 270 },
    { label: 'NW', angle: 315 },
  ]

  const width = 300
  const height = 80
  const viewRange = 90 // degrees visible at once
  const pixelsPerDegree = width / viewRange

  const [dragStart, setDragStart] = useState<{ x: number; bearing: number } | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = dialRef.current?.getBoundingClientRect()
    if (rect) {
      setDragStart({
        x: e.clientX,
        bearing: value
      })
    }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStart) return
      
      const deltaX = e.clientX - dragStart.x
      const deltaDegreesRaw = -deltaX / pixelsPerDegree // Negative for correct direction
      
      let newBearing = dragStart.bearing + deltaDegreesRaw
      
      // Normalize to 0-359 range
      while (newBearing < 0) newBearing += 360
      while (newBearing >= 360) newBearing -= 360
      
      // Allow continuous selection - no snapping to increments
      if (newBearing >= 360) newBearing = 0
      
      onChange(newBearing)
    },
    [isDragging, dragStart, pixelsPerDegree, onChange]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Generate visible marks and labels
  const centerBearing = value
  const startBearing = centerBearing - viewRange / 2
  const endBearing = centerBearing + viewRange / 2

  const visibleMarks: Array<{ x: number; bearing: number; isMajor: boolean }> = []
  const visibleLabels: Array<{ x: number; label: string; bearing: number }> = []

  // Generate marks every 5 degrees
  for (let bearing = Math.floor(startBearing / 5) * 5; bearing <= endBearing + 5; bearing += 5) {
    const normalizedBearing = ((bearing % 360) + 360) % 360
    const x = width / 2 + (bearing - centerBearing) * pixelsPerDegree
    
    if (x >= -10 && x <= width + 10) {
      const isMajor = normalizedBearing % 45 === 0
      visibleMarks.push({
        x,
        bearing: normalizedBearing,
        isMajor
      })
    }
  }

  // Generate direction labels
  directions.forEach(dir => {
    const x = width / 2 + (dir.angle - centerBearing) * pixelsPerDegree
    
    // Handle wraparound cases
    const altX1 = width / 2 + (dir.angle - 360 - centerBearing) * pixelsPerDegree
    const altX2 = width / 2 + (dir.angle + 360 - centerBearing) * pixelsPerDegree
    
    if ((x >= -20 && x <= width + 20) || 
        (altX1 >= -20 && altX1 <= width + 20) || 
        (altX2 >= -20 && altX2 <= width + 20)) {
      const finalX = (x >= -20 && x <= width + 20) ? x : 
                    (altX1 >= -20 && altX1 <= width + 20) ? altX1 : altX2
      visibleLabels.push({
        x: finalX,
        label: dir.label,
        bearing: dir.angle
      })
    }
  })

  return (
    <div className="compass-dial-container">
      <svg
        ref={dialRef}
        width={width}
        height={height}
        className="compass-dial-linear"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Background */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="rgba(0, 0, 0, 0.8)"
          stroke="#00ff00"
          strokeWidth="2"
        />

        {/* Hash marks */}
        {visibleMarks.map((mark, index) => (
          <line
            key={index}
            x1={mark.x}
            y1={height - (mark.isMajor ? 40 : 25)}
            x2={mark.x}
            y2={height}
            stroke="#00ff00"
            strokeWidth={mark.isMajor ? "3" : "2"}
            opacity={mark.isMajor ? 1 : 0.7}
          />
        ))}

        {/* Direction labels */}
        {visibleLabels.map((label, index) => (
          <text
            key={index}
            x={label.x}
            y="20"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#00ff00"
            fontSize="16"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {label.label}
          </text>
        ))}

        {/* Center indicator (fixed yellow arrow pointing down) */}
        <polygon
          points={`${width/2},${height-30} ${width/2-6},${height-40} ${width/2+6},${height-40}`}
          fill="#ffff00"
          stroke="#000000"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}
