import { useRef, useEffect, useState } from 'react';
import { POI, POIType } from '../types/poi';

interface MapCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  onPOIAdd?: (poi: POI) => void;
}

export default function MapCanvas({ 
  width = 800, 
  height = 600, 
  className = '',
  onPOIAdd
}: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pois, setPois] = useState<POI[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up coordinate system with origin at center
    ctx.save();
    ctx.translate(width / 2, height / 2);

    // Draw coordinate grid (light blue, ocean-like)
    ctx.strokeStyle = 'rgba(69, 183, 209, 0.2)';
    ctx.lineWidth = 1;

    // Draw grid lines
    const gridSize = 50;
    for (let x = -width / 2; x <= width / 2; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, -height / 2);
      ctx.lineTo(x, height / 2);
      ctx.stroke();
    }

    for (let y = -height / 2; y <= height / 2; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(-width / 2, y);
      ctx.lineTo(width / 2, y);
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

    // Draw POIs
    pois.forEach(poi => {
      ctx.fillStyle = '#f39c12'; // Orange for POIs
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(poi.x, poi.y, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Label POI
      ctx.fillStyle = '#2c3e50';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(poi.name, poi.x, poi.y - 10);
    });

    ctx.restore();
  }, [width, height, pois]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - width / 2; // Convert to canvas coordinates
    const y = event.clientY - rect.top - height / 2;

    // Check if clicking on existing POI for deletion (right-click)
    if (event.button === 2) {
      const clickedPOI = pois.find(poi => {
        const distance = Math.sqrt((poi.x - x) ** 2 + (poi.y - y) ** 2);
        return distance <= 10; // 10px tolerance for clicking on POI
      });

      if (clickedPOI) {
        setPois(prev => prev.filter(poi => poi.id !== clickedPOI.id));
        return;
      }
    }

    // Create new POI (left-click only)
    if (event.button === 0) {
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
    }
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault(); // Prevent browser context menu
  };

  return (
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
      onContextMenu={handleContextMenu}
    />
  );
}
