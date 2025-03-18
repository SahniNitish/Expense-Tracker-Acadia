
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchMonthlySummary } from '@/utils/api';

const MonthlyBarChart: React.FC = () => {
  const { data: monthlyData = [], isLoading } = useQuery({
    queryKey: ['monthlySummary'],
    queryFn: async () => {
      const response = await fetchMonthlySummary();
      return response.data;
    }
  });

  if (isLoading) {
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

  if (monthlyData.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Income vs Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">No monthly data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Monthly Income vs Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, '']} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#4ade80" />
              <Bar dataKey="expense" name="Expenses" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyBarChart;
