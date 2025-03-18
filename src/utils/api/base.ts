
import { toast } from 'sonner';

export const API_URL = 'http://localhost:5001/api';
export const USE_MOCK_DATA = true; // Set to true to use mock data when the backend is unavailable

// Function to handle API responses
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

// Fallback to mock data if the backend is unavailable
export const handleApiError = (error: any, mockDataFn: Function, ...args: any[]) => {
  console.error('API error:', error);
  
  // If backend is unavailable and mock data is disabled, try to fallback to mock mode
  if (error.message === 'Failed to fetch' && !USE_MOCK_DATA) {
    console.log('Backend unavailable, falling back to mock data');
    return mockDataFn(...args);
  }
  
  throw error;
};
