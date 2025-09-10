import { useRef, useEffect, useState } from 'react';
import { POI, POI_METADATA, LIFEBOAT_5 } from '../types/poi';
import { recalculatePOICoordinates } from '../utils/bearingCalculations';
import POIDetailsSidebar from './POIDetailsSidebar';

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
  const [pois, setPois] = useState<POI[]>([LIFEBOAT_5]);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [isAddingPOI, setIsAddingPOI] = useState(false);
  const [newPOICoordinates, setNewPOICoordinates] = useState<{x: number, y: number} | null>(null);
  
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

    // Draw coordinate grid (cyan theme to match old version)
    ctx.strokeStyle = '#374151';
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

    ctx.restore();

    // Origin point (Lifeboat 5) is now rendered as a regular POI with special emoji

    // Draw POIs in screen coordinates
    pois.forEach(poi => {
      // Transform world coordinates to screen coordinates
      // This should match the canvas transformation: translate(width/2 + panOffset.x, height/2 + panOffset.y) then scale(zoomScale)
      const screenX = (poi.x * zoomScale) + (width / 2 + panOffset.x);
      const screenY = (poi.y * zoomScale) + (height / 2 + panOffset.y);
      
      // Draw POI emoji
      const poiMetadata = POI_METADATA[poi.type];
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(poiMetadata.emoji, screenX, screenY + 5); // +5 to center emoji vertically

      // Label POI
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(poi.name, screenX, screenY - 15);
    });

    // Draw temporary POI when in ADD mode
    if (isAddingPOI && newPOICoordinates) {
      const screenX = (newPOICoordinates.x * zoomScale) + (width / 2 + panOffset.x);
      const screenY = (newPOICoordinates.y * zoomScale) + (height / 2 + panOffset.y);
      
      // Draw temporary POI with semi-transparent styling
      ctx.globalAlpha = 0.6;
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🎯', screenX, screenY + 5); // Default landmark emoji

      // Draw dashed circle around temporary POI
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(screenX, screenY, 20, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Label temporary POI
      ctx.fillStyle = '#00ff00';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('New POI', screenX, screenY - 25);
      
      ctx.globalAlpha = 1.0; // Reset alpha
    }

  }, [width, height, pois, panOffset, zoomScale, isAddingPOI, newPOICoordinates]);

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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - width / 2 - panOffset.x) / zoomScale;
    const y = (event.clientY - rect.top - height / 2 - panOffset.y) / zoomScale;

    // If there's a provisional POI, cancel it on any left click
    if (newPOICoordinates) {
      setNewPOICoordinates(null);
      return;
    }

    // Check if we clicked on an existing POI to show details
    const clickedPOI = pois.find(poi => {
      const distance = Math.sqrt((poi.x - x) ** 2 + (poi.y - y) ** 2);
      return distance <= 10 / zoomScale; // Scale tolerance with zoom level
    });

    if (clickedPOI) {
      // Show POI details in sidebar
      setSelectedPOI(clickedPOI);
    }
    // Left-click on empty space does nothing (read-only)
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - width / 2 - panOffset.x) / zoomScale;
    const y = (event.clientY - rect.top - height / 2 - panOffset.y) / zoomScale;

    // Handle right-click for POI creation
    if (event.button === 2) {
      // Check if we right-clicked on an existing POI (don't create new one)
      const clickedPOI = pois.find(poi => {
        const distance = Math.sqrt((poi.x - x) ** 2 + (poi.y - y) ** 2);
        return distance <= 10 / zoomScale; // Scale tolerance with zoom level
      });

      if (!clickedPOI) {
        // Open ADD sidebar with coordinates for new POI
        setNewPOICoordinates({ x, y });
        setIsAddingPOI(true);
        setSelectedPOI(null); // Clear any selected POI
      }
      return;
    }

    // Handle left-click for POI selection and dragging
    if (event.button === 0) {
      // Check if we clicked on an existing POI
      const clickedPOI = pois.find(poi => {
        const distance = Math.sqrt((poi.x - x) ** 2 + (poi.y - y) ** 2);
        return distance <= 10 / zoomScale; // Scale tolerance with zoom level
      });

      if (clickedPOI) {
        // Switch to showing the clicked POI (even if we're in ADD mode)
        setSelectedPOI(clickedPOI);
        setIsAddingPOI(false);
        setNewPOICoordinates(null);
      } else {
        // If we're in ADD mode, clicking empty space cancels it
        if (isAddingPOI) {
          setIsAddingPOI(false);
          setNewPOICoordinates(null);
          setSelectedPOI(null);
          return;
        }
        
        // Otherwise close sidebar and start dragging
        setSelectedPOI(null);
        setIsDragging(true);
        setDragStart({
          x: event.clientX - panOffset.x,
          y: event.clientY - panOffset.y
        });
      }
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

  // Handle escape key to cancel ADD mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isAddingPOI) {
        setIsAddingPOI(false);
        setNewPOICoordinates(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddingPOI]);

  const handlePOIDelete = (poiId: string) => {
    setPois(prev => prev.filter(poi => poi.id !== poiId));
  };

  const handlePOIUpdate = (updatedPOI: POI) => {
    // Recalculate coordinates if POI uses bearings
    const recalculatedPOI = updatedPOI.definitionMode === 'bearings' 
      ? recalculatePOICoordinates(updatedPOI, pois)
      : updatedPOI;
    
    setPois(prev => prev.map(poi => poi.id === recalculatedPOI.id ? recalculatedPOI : poi));
    setSelectedPOI(recalculatedPOI); // Update the selected POI to reflect changes
  };

  const handlePOISave = (newPOI: POI) => {
    // Add coordinates from newPOICoordinates if this is a new POI
    if (isAddingPOI && newPOICoordinates) {
      let poiWithCoords = {
        ...newPOI,
        x: newPOICoordinates.x,
        y: newPOICoordinates.y
      };
      
      // Recalculate coordinates if POI uses bearings
      if (newPOI.definitionMode === 'bearings') {
        poiWithCoords = recalculatePOICoordinates(poiWithCoords, pois);
      }
      
      setPois(prev => [...prev, poiWithCoords]);
      setIsAddingPOI(false);
      setNewPOICoordinates(null);
      setSelectedPOI(null); // Close sidebar after saving
      onPOIAdd?.(poiWithCoords);
    }
  };

  const handleSidebarClose = () => {
    setSelectedPOI(null);
    // If closing sidebar in ADD mode, cancel it
    if (isAddingPOI) {
      setIsAddingPOI(false);
      setNewPOICoordinates(null);
    }
  };

  return (
    <>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={`border border-gray-300 ${className}`}
          style={{ 
            backgroundColor: '#0f172a', // Dark slate background to match old version
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
      
      {(selectedPOI || isAddingPOI) && (
        <POIDetailsSidebar 
          poi={selectedPOI}
          onClose={handleSidebarClose}
          onDelete={handlePOIDelete}
          onUpdate={handlePOIUpdate}
          onSave={handlePOISave}
          isProvisional={isAddingPOI}
          coordinates={newPOICoordinates}
          allPOIs={pois}
        />
      )}
    </>
  );
}
