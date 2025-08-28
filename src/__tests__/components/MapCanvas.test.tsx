import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MapCanvas from '../../components/MapCanvas';

// Mock canvas context
const mockContext = {
  clearRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  fillText: vi.fn(),
};

// Mock canvas getContext with proper typing
const mockGetContext = vi.fn();
mockGetContext.mockImplementation((contextId: string) => {
  if (contextId === '2d') {
    return mockContext as unknown as CanvasRenderingContext2D;
  }
  return null;
});
HTMLCanvasElement.prototype.getContext = mockGetContext as any;

describe('MapCanvas', () => {
  it('renders canvas element with default dimensions', () => {
    render(<MapCanvas />);
    
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('width', '800');
    expect(canvas).toHaveAttribute('height', '600');
  });

  it('renders canvas with custom dimensions', () => {
    render(<MapCanvas width={400} height={300} />);
    
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveAttribute('width', '400');
    expect(canvas).toHaveAttribute('height', '300');
  });

  it('applies custom className', () => {
    render(<MapCanvas className="custom-class" />);
    
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveClass('custom-class');
  });

  it('has ocean blue background and crosshair cursor', () => {
    render(<MapCanvas />);
    
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveStyle({ 
      backgroundColor: '#1e3a8a',
      cursor: 'crosshair'
    });
  });

  it('initializes canvas context and draws grid', () => {
    render(<MapCanvas width={400} height={300} />);
    
    // Verify context methods were called for drawing
    expect(mockContext.clearRect).toHaveBeenCalled();
    expect(mockContext.translate).toHaveBeenCalledWith(200, 150); // center of 400x300
    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.stroke).toHaveBeenCalled();
  });

  it('handles canvas click to add POI', () => {
    const onPOIAdd = vi.fn();
    render(<MapCanvas onPOIAdd={onPOIAdd} />);
    
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    // Mock getBoundingClientRect
    canvas!.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: vi.fn()
    }));

    // Click at position (100, 50) relative to canvas
    fireEvent.click(canvas!, {
      clientX: 100,
      clientY: 50
    });

    // Should call onPOIAdd with new POI
    expect(onPOIAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'POI 1',
        type: 'landmark',
        x: -300, // 100 - 400 (half width)
        y: -250, // 50 - 300 (half height)
        notes: 'Click to edit'
      })
    );
  });
});
