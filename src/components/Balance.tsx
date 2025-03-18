
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '@/utils/api';

const Balance: React.FC = () => {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions
  });

  const calculateBalance = () => {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === 'income' 
        ? balance + transaction.amount 
        : balance - transaction.amount;
    }, 0);
  };

  const calculateTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const calculateTotalExpense = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const balance = calculateBalance();
  const totalIncome = calculateTotalIncome();
  const totalExpense = calculateTotalExpense();

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardContent className="py-6">
            <p className="text-center">Loading balance...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${balance.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
            Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${totalIncome.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            ${totalExpense.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Balance;
