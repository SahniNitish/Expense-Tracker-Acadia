import { Transaction } from '../types';
import { API_URL, USE_MOCK_DATA, handleResponse, handleApiError } from './base';
import { getCurrentUser } from './auth';

const getUserTransactions = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  
  const storageKey = `mockTransactions-${currentUser._id}`;
  const storedTransactions = localStorage.getItem(storageKey);
  
  if (storedTransactions) {
    return JSON.parse(storedTransactions);
  }
  
  localStorage.setItem(storageKey, JSON.stringify([]));
  return [];
};

const saveUserTransactions = (transactions: Transaction[]) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  
  const storageKey = `mockTransactions-${currentUser._id}`;
  localStorage.setItem(storageKey, JSON.stringify(transactions));
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  if (USE_MOCK_DATA) {
    console.log('Using mock transactions data');
    return getUserTransactions();
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await handleResponse(response);
    return data.data.map((item: any) => ({
      id: item._id,
      amount: item.amount,
      description: item.description,
      category: item.category,
      date: new Date(item.date).toISOString(),
      type: item.type,
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return getUserTransactions();
  }
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  if (USE_MOCK_DATA) {
    console.log('Adding mock transaction:', transaction);
    const transactions = getUserTransactions();
    
    const newTransaction = {
      id: Math.random().toString(36).substring(2, 9),
      ...transaction
    };
    
    transactions.push(newTransaction);
    saveUserTransactions(transactions);
    
    return { ...newTransaction };
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(transaction)
    });
    const data = await handleResponse(response);
    return {
      id: data.data._id,
      amount: data.data.amount,
      description: data.data.description,
      category: data.data.category,
      date: new Date(data.data.date).toISOString(),
      type: data.data.type,
    };
  } catch (error) {
    console.error('Error adding transaction:', error);
    const transactions = getUserTransactions();
    
    const newTransaction = {
      id: Math.random().toString(36).substring(2, 9),
      ...transaction
    };
    
    transactions.push(newTransaction);
    saveUserTransactions(transactions);
    
    return { ...newTransaction };
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    console.log('Deleting mock transaction with ID:', id);
    const transactions = getUserTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== id);
    saveUserTransactions(filteredTransactions);
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    await handleResponse(response);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    const transactions = getUserTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== id);
    saveUserTransactions(filteredTransactions);
  }
};

export const fetchMonthlySummary = async (): Promise<{ data: import('../types').MonthlyData[] }> => {
  if (USE_MOCK_DATA) {
    console.log('Using mock monthly summary data');
    
    const transactions = getUserTransactions();
    if (transactions.length === 0) {
      return { data: [] };
    }
    
    const monthlyData = generateMonthlySummary(transactions);
    return { data: monthlyData };
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/transactions/summary/monthly`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching monthly summary:', error);
    
    const transactions = getUserTransactions();
    const monthlyData = generateMonthlySummary(transactions);
    return { data: monthlyData };
  }
};

const generateMonthlySummary = (transactions: Transaction[]) => {
  const monthMap: Record<string, { month: string, income: number, expense: number }> = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const monthName = new Date(date.getFullYear(), date.getMonth()).toLocaleString('default', { month: 'long' });
    
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = {
        month: monthName,
        income: 0,
        expense: 0
      };
    }
    
    if (transaction.type === 'income') {
      monthMap[monthKey].income += transaction.amount;
    } else {
      monthMap[monthKey].expense += transaction.amount;
    }
  });
  
  return Object.values(monthMap);
};
