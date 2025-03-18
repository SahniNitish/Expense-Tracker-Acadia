
import { API_URL, USE_MOCK_DATA, handleResponse, handleApiError } from './base';

// Mock user data for when the backend is unavailable
const mockUsers = [
  {
    _id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123'
  }
];

export const registerUser = async (userData: { name: string, email: string, password: string }) => {
  console.log('Register user called with data:', userData);
  try {
    if (USE_MOCK_DATA) {
      console.log('Using mock registration data');
      
      // Check if user already exists in mock data
      const existingUser = mockUsers.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Create new mock user
      const newUser = {
        _id: (mockUsers.length + 1).toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password
      };
      
      mockUsers.push(newUser);
      
      // Generate mock token and store user data
      const token = `mock-token-${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }));
      
      // Clear any existing mock data when a new user registers
      localStorage.setItem('mockTransactions', JSON.stringify([]));
      
      return {
        success: true,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email
        },
        token
      };
    }
    
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const data = await handleResponse(response);
    
    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error: any) {
    return handleApiError(error, registerUser, userData);
  }
};

export const loginUser = async (credentials: { email: string, password: string }) => {
  try {
    if (USE_MOCK_DATA) {
      console.log('Using mock login data');
      
      // Check credentials against mock data
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user || user.password !== credentials.password) {
        throw new Error('Invalid credentials');
      }
      
      // Generate mock token and store user data
      const token = `mock-token-${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email
      }));
      
      // Initialize empty mock data for new user login
      if (!localStorage.getItem('mockTransactions-' + user._id)) {
        localStorage.setItem('mockTransactions-' + user._id, JSON.stringify([]));
      }
      
      return {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        },
        token
      };
    }
    
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await handleResponse(response);
    
    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error: any) {
    return handleApiError(error, loginUser, credentials);
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
