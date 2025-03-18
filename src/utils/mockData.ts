
import { Transaction, Category, MonthlyData } from './types';

export const categories: Category[] = [
  { id: '1', name: 'Food', color: '#FF5733' },
  { id: '2', name: 'Transportation', color: '#33A8FF' },
  { id: '3', name: 'Housing', color: '#FF33A8' },
  { id: '4', name: 'Entertainment', color: '#33FF57' },
  { id: '5', name: 'Utilities', color: '#A833FF' },
  { id: '6', name: 'Healthcare', color: '#FFBD33' },
  { id: '7', name: 'Salary', color: '#33FFC4' },
  { id: '8', name: 'Investments', color: '#C4FF33' },
];

export const transactions: Transaction[] = [
  {
    id: '1',
    amount: 2500,
    description: 'Monthly Salary',
    category: 'Salary',
    date: '2023-07-01',
    type: 'income',
  },
  {
    id: '2',
    amount: 45.99,
    description: 'Grocery Shopping',
    category: 'Food',
    date: '2023-07-03',
    type: 'expense',
  },
  {
    id: '3',
    amount: 120,
    description: 'Electricity Bill',
    category: 'Utilities',
    date: '2023-07-05',
    type: 'expense',
  },
  {
    id: '4',
    amount: 35.5,
    description: 'Gas',
    category: 'Transportation',
    date: '2023-07-07',
    type: 'expense',
  },
  {
    id: '5',
    amount: 800,
    description: 'Rent',
    category: 'Housing',
    date: '2023-07-01',
    type: 'expense',
  },
  {
    id: '6',
    amount: 200,
    description: 'Freelance Work',
    category: 'Salary',
    date: '2023-07-15',
    type: 'income',
  },
  {
    id: '7',
    amount: 60,
    description: 'Dinner with friends',
    category: 'Food',
    date: '2023-07-18',
    type: 'expense',
  },
  {
    id: '8',
    amount: 25,
    description: 'Movie tickets',
    category: 'Entertainment',
    date: '2023-07-20',
    type: 'expense',
  },
];

export const monthlyData: MonthlyData[] = [
  { month: 'Jan', income: 3200, expense: 2700 },
  { month: 'Feb', income: 3100, expense: 2900 },
  { month: 'Mar', income: 3400, expense: 2800 },
  { month: 'Apr', income: 3300, expense: 3100 },
  { month: 'May', income: 3500, expense: 2950 },
  { month: 'Jun', income: 3600, expense: 3050 },
  { month: 'Jul', income: 2700, expense: 2086.49 },
];

export const getCategoryById = (categoryName: string): Category => {
  const category = categories.find(c => c.name === categoryName);
  return category || { id: '0', name: categoryName, color: '#808080' };
};

export const calculateBalance = (): number => {
  return transactions.reduce((balance, transaction) => {
    return transaction.type === 'income' 
      ? balance + transaction.amount 
      : balance - transaction.amount;
  }, 0);
};

export const calculateTotalIncome = (): number => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateTotalExpense = (): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const getExpensesByCategory = () => {
  const expensesByCategory: Record<string, number> = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      if (expensesByCategory[transaction.category]) {
        expensesByCategory[transaction.category] += transaction.amount;
      } else {
        expensesByCategory[transaction.category] = transaction.amount;
      }
    });
  
  return Object.entries(expensesByCategory).map(([name, value]) => {
    const category = getCategoryById(name);
    return {
      name,
      value,
      color: category.color
    };
  });
};
