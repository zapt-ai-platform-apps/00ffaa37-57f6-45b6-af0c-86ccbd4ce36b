import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MetricChart from './MetricChart';
import * as api from './api';

// Mock the API response
vi.mock('./api', () => ({
  getMetricHistory: vi.fn()
}));

// Mock Chart.js 
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="chart-component">Chart Component</div>
}));

describe('MetricChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    api.getMetricHistory.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<MetricChart appId="test-id" metricType="user_count" title="User Count" />);
    
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('displays chart when data is available', async () => {
    // Mock successful API response with data
    api.getMetricHistory.mockResolvedValue([
      { recordedAt: '2023-01-01T00:00:00Z', value: 100 },
      { recordedAt: '2023-01-02T00:00:00Z', value: 200 },
      { recordedAt: '2023-01-03T00:00:00Z', value: 300 }
    ]);
    
    render(<MetricChart appId="test-id" metricType="user_count" title="User Count" />);
    
    // Wait for chart to appear
    expect(await screen.findByTestId('chart-component')).toBeDefined();
  });

  it('shows empty state when no data is available', async () => {
    // Mock API response with empty array
    api.getMetricHistory.mockResolvedValue([]);
    
    render(<MetricChart appId="test-id" metricType="user_count" title="User Count" />);
    
    // Check for empty state message
    expect(await screen.findByText(/No user count data available yet/i)).toBeDefined();
  });

  it('displays error message when API call fails', async () => {
    // Mock API failure
    api.getMetricHistory.mockRejectedValue(new Error('API Error'));
    
    render(<MetricChart appId="test-id" metricType="user_count" title="User Count" />);
    
    // Check for error message
    expect(await screen.findByText(/Failed to load user count chart/i)).toBeDefined();
  });
});