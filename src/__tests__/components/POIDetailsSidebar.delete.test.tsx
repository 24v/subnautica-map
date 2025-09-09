import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import POIDetailsSidebar from '../../components/POIDetailsSidebar';
import { POI } from '../../types/poi';

// Mock window.confirm
const mockConfirm = vi.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

describe('POIDetailsSidebar Delete Functionality', () => {
  const mockPOI: POI = {
    id: 'test-poi-1',
    name: 'Test POI',
    type: 'landmark',
    x: 100,
    y: 200,
    notes: 'Test notes',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  };

  const mockOnClose = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockClear();
  });

  it('should show delete button when onDelete is provided', () => {
    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete poi/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it('should show confirmation dialog when delete button is clicked', async () => {
    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete poi/i });
    fireEvent.click(deleteButton);

    // Check that the confirmation dialog appears
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('should not call onDelete when user cancels confirmation', async () => {
    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete poi/i });
    fireEvent.click(deleteButton);

    // Click cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should call onDelete and onClose when user confirms deletion', async () => {
    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete poi/i });
    fireEvent.click(deleteButton);

    // Click delete button in confirmation dialog
    const confirmDeleteButton = screen.getByText('Delete');
    fireEvent.click(confirmDeleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('test-poi-1');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not show delete button when onDelete prop is not provided', () => {
    render(
      <POIDetailsSidebar 
        poi={mockPOI} 
        onClose={mockOnClose} 
      />
    );

    const deleteButton = screen.queryByRole('button', { name: /delete poi/i });
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('should handle delete with special characters in POI name', async () => {
    const specialPOI = {
      ...mockPOI,
      name: 'POI "with quotes" & symbols'
    };

    render(
      <POIDetailsSidebar 
        poi={specialPOI} 
        onClose={mockOnClose} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete poi/i });
    fireEvent.click(deleteButton);

    // Check that the confirmation dialog appears with special characters
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
  });
});
