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
  depth: 0,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  definitionMode: 'coordinates',
};

describe('POIDetailsSidebar', () => {
  it('renders POI details correctly', () => {
    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnSave = vi.fn();

    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByDisplayValue('Test POI')).toBeInTheDocument();
    expect(screen.getByText('🎯 Landmark')).toBeInTheDocument();
    expect(screen.getByText('X: 100.0, Y: 200.0')).toBeInTheDocument();
    expect(screen.getByText('Test notes')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnSave = vi.fn();

    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
      />
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked and confirmed', async () => {
    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnSave = vi.fn();

    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Click delete button in confirmation dialog
    const confirmButtons = screen.getAllByRole('button', { name: /delete/i });
    // The confirm button should be the second one (first is the sidebar delete button)
    fireEvent.click(confirmButtons[1]);

    expect(mockOnDelete).toHaveBeenCalledWith('test-poi-1');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('formats coordinates correctly', () => {
    const poiWithNegativeCoords: POI = {
      ...mockPOI,
      x: -150.5,
      y: 75.25
    };

    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnSave = vi.fn();

    render(
      <POIDetailsSidebar 
        poi={poiWithNegativeCoords} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('X: -150.5, Y: 75.3')).toBeInTheDocument();
  });

  it('displays creation timestamp correctly', () => {
    const mockOnClose = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnSave = vi.fn();

    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
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
    const mockOnUpdate = vi.fn();
    const mockOnSave = vi.fn();

    render(
      <POIDetailsSidebar 
        poi={resourcePOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByDisplayValue('Copper Ore')).toBeInTheDocument();
    expect(screen.getByText('💎 Resource')).toBeInTheDocument();
  });
});
