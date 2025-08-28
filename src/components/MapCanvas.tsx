import { useRef, useEffect } from 'react';

interface MapCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function MapCanvas({ 
  width = 800, 
  height = 600, 
  className = '' 
}: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    ctx.restore();
  }, [width, height]);

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
    />
  );
}
