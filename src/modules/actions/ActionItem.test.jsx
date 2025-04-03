import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionItem from './ActionItem';

describe('ActionItem Component', () => {
  const mockAction = {
    id: '123',
    text: 'Test action',
    completed: false
  };
  
  const mockToggle = vi.fn();
  const mockDelete = vi.fn();
  
  it('renders correctly with pending action', () => {
    render(
      <ActionItem 
        action={mockAction}
        onToggle={mockToggle}
        onDelete={mockDelete}
      />
    );
    
    expect(screen.getByText('Test action')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
  
  it('renders correctly with completed action', () => {
    render(
      <ActionItem 
        action={{ ...mockAction, completed: true }}
        onToggle={mockToggle}
        onDelete={mockDelete}
      />
    );
    
    expect(screen.getByText('Test action')).toHaveClass('line-through');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
  
  it('calls onToggle with action id when checkbox is clicked', () => {
    render(
      <ActionItem 
        action={mockAction}
        onToggle={mockToggle}
        onDelete={mockDelete}
      />
    );
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockToggle).toHaveBeenCalledWith(mockAction.id);
  });
  
  it('shows delete confirmation when delete button is clicked', () => {
    render(
      <ActionItem 
        action={mockAction}
        onToggle={mockToggle}
        onDelete={mockDelete}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Delete action'));
    expect(screen.getByText('Confirm delete?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });
  
  it('cancels delete confirmation when No is clicked', () => {
    render(
      <ActionItem 
        action={mockAction}
        onToggle={mockToggle}
        onDelete={mockDelete}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Delete action'));
    fireEvent.click(screen.getByText('No'));
    
    expect(screen.queryByText('Confirm delete?')).not.toBeInTheDocument();
    expect(mockDelete).not.toHaveBeenCalled();
  });
  
  it('calls onDelete with action id when Yes is clicked', () => {
    render(
      <ActionItem 
        action={mockAction}
        onToggle={mockToggle}
        onDelete={mockDelete}
      />
    );
    
    fireEvent.click(screen.getByLabelText('Delete action'));
    fireEvent.click(screen.getByText('Yes'));
    
    expect(mockDelete).toHaveBeenCalledWith(mockAction.id);
  });
});