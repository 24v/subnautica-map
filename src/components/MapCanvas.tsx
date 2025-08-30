import { useRef, useEffect, useState } from 'react';
import { POI, POIType } from '../types/poi';

interface MapCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  onPOIAdd?: (poi: POI) => void;
  onResetView?: () => void;
}

export default function MapCanvas({ 
  width = 800, 
  height = 600, 
  className = '',
  onPOIAdd,
  onResetView
}: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pois, setPois] = useState<POI[]>([]);
  
  // Pan state management
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Zoom state management
  const [zoomScale, setZoomScale] = useState(1);
  const minZoom = 0.1;
  const maxZoom = 5;

  // Reset view function
  const resetView = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomScale(1);
    onResetView?.();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up coordinate system with origin at center + pan offset + zoom
    ctx.save();
    ctx.translate(width / 2 + panOffset.x, height / 2 + panOffset.y);
    ctx.scale(zoomScale, zoomScale);

    // Draw coordinate grid (light blue, ocean-like)
    ctx.strokeStyle = 'rgba(69, 183, 209, 0.2)';
    ctx.lineWidth = 1;

    // Draw infinite grid lines that extend beyond viewport when panned
    const gridSize = 50;
    
    // Calculate extended bounds to cover panned and zoomed area
    const extendedWidth = (width + Math.abs(panOffset.x) * 2) / zoomScale;
    const extendedHeight = (height + Math.abs(panOffset.y) * 2) / zoomScale;
    
    // Calculate grid start positions to align with grid (in world coordinates)
    const gridStartX = Math.floor((-extendedWidth / 2 - panOffset.x / zoomScale) / gridSize) * gridSize;
    const gridEndX = Math.ceil((extendedWidth / 2 - panOffset.x / zoomScale) / gridSize) * gridSize;
    const gridStartY = Math.floor((-extendedHeight / 2 - panOffset.y / zoomScale) / gridSize) * gridSize;
    const gridEndY = Math.ceil((extendedHeight / 2 - panOffset.y / zoomScale) / gridSize) * gridSize;
    
    // Draw vertical grid lines
    for (let x = gridStartX; x <= gridEndX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, gridStartY);
      ctx.lineTo(x, gridEndY);
      ctx.stroke();
    }

    // Draw horizontal grid lines
    for (let y = gridStartY; y <= gridEndY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(gridStartX, y);
      ctx.lineTo(gridEndX, y);
      ctx.stroke();
    }

    // Draw origin point (Lifeboat 5)
    ctx.fillStyle = '#f9ca24';
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Label origin
    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Lifeboat 5', 0, -15);

    ctx.restore();

    // Draw POIs in screen coordinates (after restore to avoid scaling)
    pois.forEach(poi => {
      // Transform world coordinates to screen coordinates
      // This should match the canvas transformation: translate(width/2 + panOffset.x, height/2 + panOffset.y) then scale(zoomScale)
      const screenX = (poi.x * zoomScale) + (width / 2 + panOffset.x);
      const screenY = (poi.y * zoomScale) + (height / 2 + panOffset.y);
      
      ctx.fillStyle = '#f39c12'; // Orange for POIs
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Label POI
      ctx.fillStyle = '#2c3e50';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(poi.name, screenX, screenY - 10);
    });
  }, [width, height, pois, panOffset, zoomScale]);

  // Separate useEffect for wheel event listener to fix passive event warnings
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelEvent = (event: WheelEvent) => {
      event.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Calculate zoom factor (negative deltaY = zoom in, positive = zoom out)
      const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
      const newZoomScale = Math.max(minZoom, Math.min(maxZoom, zoomScale * zoomFactor));
      
      if (newZoomScale !== zoomScale) {
        // Calculate zoom-to-cursor offset adjustment
        // Convert mouse position to world coordinates before zoom
        const worldMouseX = (mouseX - width / 2 - panOffset.x) / zoomScale;
        const worldMouseY = (mouseY - height / 2 - panOffset.y) / zoomScale;
        
        // Calculate new pan offset to keep world point under cursor
        const newPanOffset = {
          x: mouseX - width / 2 - worldMouseX * newZoomScale,
          y: mouseY - height / 2 - worldMouseY * newZoomScale
        };
        
        setZoomScale(newZoomScale);
        setPanOffset(newPanOffset);
      }
    };

    canvas.addEventListener('wheel', handleWheelEvent, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheelEvent);
    };
  }, [zoomScale, panOffset, width, height, minZoom, maxZoom]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // Don't add POI if we were dragging
    if (isDragging) return;
    
    // Only handle left-clicks for adding POIs
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - width / 2 - panOffset.x) / zoomScale; // Convert to canvas coordinates with pan offset and zoom
    const y = (event.clientY - rect.top - height / 2 - panOffset.y) / zoomScale;

    const newPOI: POI = {
      id: `poi-${Date.now()}`,
      name: `POI ${pois.length + 1}`,
      type: 'landmark' as POIType,
      x,
      y,
      notes: 'Click to edit',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setPois(prev => [...prev, newPOI]);
    onPOIAdd?.(newPOI);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - width / 2 - panOffset.x) / zoomScale;
    const y = (event.clientY - rect.top - height / 2 - panOffset.y) / zoomScale;

    // Handle right-click for deletion
    if (event.button === 2) {
      const clickedPOI = pois.find(poi => {
        const distance = Math.sqrt((poi.x - x) ** 2 + (poi.y - y) ** 2);
        return distance <= 10 / zoomScale; // Scale tolerance with zoom level
      });

      if (clickedPOI) {
        setPois(prev => prev.filter(poi => poi.id !== clickedPOI.id));
      }
      return;
    }

    // Handle left-click for dragging
    if (event.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: event.clientX - panOffset.x,
        y: event.clientY - panOffset.y
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const newPanOffset = {
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y
    };
    
    setPanOffset(newPanOffset);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };


  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault(); // Prevent browser context menu
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`border border-gray-300 ${className}`}
        style={{ 
          backgroundColor: '#1e3a8a', // Deep ocean blue background
          cursor: 'crosshair'
        }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
      />
      <button 
        className="reset-view-btn"
        onClick={resetView}
        title="Reset view to origin"
      >
        Reset View
      </button>
    </div>
  );
}
