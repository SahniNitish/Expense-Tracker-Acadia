
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChartIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions, fetchCategories } from '@/utils/api';

const CategoryPieChart: React.FC = () => {
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.color : '#808080';
  };

  const getExpensesByCategory = () => {
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
    
    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value,
      color: getCategoryColor(name)
    }));
  };

  const data = getExpensesByCategory();

  if (transactionsLoading || categoriesLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-6">
          <div className="flex justify-center">
            <p>Loading chart data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Expenses by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">No expense data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Expenses by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
