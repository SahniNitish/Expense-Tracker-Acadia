
import { Category } from '../types';
import { API_URL, USE_MOCK_DATA, handleResponse } from './base';
import { getCurrentUser } from './auth';
import { toast } from 'sonner';

// Default categories for new users
const defaultCategories = [
  { id: '1', name: 'Food', color: '#FF5733' },
  { id: '2', name: 'Transport', color: '#33A8FF' },
  { id: '3', name: 'Entertainment', color: '#9C33FF' },
  { id: '4', name: 'Housing', color: '#33FF57' },
  { id: '5', name: 'Utilities', color: '#FF33A8' },
  { id: '6', name: 'Salary', color: '#33FFA8' }
];

// Helper function to get user-specific categories
const getUserCategories = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return defaultCategories;
  
  const storageKey = `mockCategories-${currentUser._id}`;
  const storedCategories = localStorage.getItem(storageKey);
  
  if (storedCategories) {
    return JSON.parse(storedCategories);
  }
  
  // Initialize with default categories for this user
  localStorage.setItem(storageKey, JSON.stringify(defaultCategories));
  return defaultCategories;
};

export const fetchCategories = async (): Promise<Category[]> => {
  if (USE_MOCK_DATA) {
    console.log('Using mock categories data');
    return getUserCategories();
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await handleResponse(response);
    return data.data.map((item: any) => ({
      id: item._id,
      name: item.name,
      color: item.color
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    toast.error('Could not load categories. Using mock data instead.');
    return getUserCategories();
  }
};
