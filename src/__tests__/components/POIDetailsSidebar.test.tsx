import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import POIDetailsSidebar from '../../components/POIDetailsSidebar';
import type { POI } from '../../types/poi';

const mockPOI: POI = {
  id: 'test-poi-1',
  name: 'Test POI',
  type: 'landmark',
  x: 100,
  y: 200,
  notes: 'Test notes',
  createdAt: new Date('2024-01-01T12:00:00Z'),
  updatedAt: new Date('2024-01-01T12:00:00Z')
};

describe('POIDetailsSidebar', () => {
  it('renders POI details correctly', () => {
    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Test POI')).toBeInTheDocument();
    expect(screen.getByText('Landmark')).toBeInTheDocument();
    expect(screen.getByText('X: 100.0, Y: 200.0')).toBeInTheDocument();
    expect(screen.getByText('Test notes')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete} 
      />
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();
    
    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByText('🗑️ Delete POI');
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith('Delete POI "Test POI"?');
    expect(mockOnDelete).toHaveBeenCalledWith('test-poi-1');
    expect(mockOnClose).toHaveBeenCalled();
    
    confirmSpy.mockRestore();
  });

  it('formats coordinates correctly', () => {
    const poiWithNegativeCoords: POI = {
      ...mockPOI,
      x: -150.5,
      y: 75.25
    };

    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <POIDetailsSidebar 
        poi={poiWithNegativeCoords} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('X: -150.5, Y: 75.3')).toBeInTheDocument();
  });

  it('displays creation timestamp correctly', () => {
    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete} 
      />
    );

    // Check that the date is displayed (format may vary by locale)
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('renders with different POI types', () => {
    const resourcePOI: POI = {
      ...mockPOI,
      type: 'resource',
      name: 'Copper Ore'
    };

    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <POIDetailsSidebar 
        poi={resourcePOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Copper Ore')).toBeInTheDocument();
    expect(screen.getByText('Resource')).toBeInTheDocument();
  });
});
