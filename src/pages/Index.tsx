
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Balance from '@/components/Balance';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import CategoryPieChart from '@/components/CategoryPieChart';
import MonthlyBarChart from '@/components/MonthlyBarChart';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isAuthenticated } from '@/utils/api';

const Index: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleRefresh = () => {
    // Force refetch all data
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    queryClient.invalidateQueries({ queryKey: ['monthlySummary'] });
    queryClient.invalidateQueries({ queryKey: ['balance'] });
    
    // Clear any cached data to ensure fresh fetch
    queryClient.resetQueries({ queryKey: ['transactions'] });
    queryClient.resetQueries({ queryKey: ['categories'] });
    queryClient.resetQueries({ queryKey: ['monthlySummary'] });
    queryClient.resetQueries({ queryKey: ['balance'] });
    
    toast.success('Data refreshed successfully!');
  };

  if (!isAuthenticated()) {
    return null; // Don't render anything if not authenticated
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow p-4 md:p-6">
        <div className="container mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button onClick={handleRefresh} size="sm" variant="outline" className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
          
          {/* Balance Cards */}
          <Balance />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <TransactionForm />
              <CategoryPieChart />
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <TransactionList />
              <MonthlyBarChart />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-muted py-4 text-center text-muted-foreground text-sm">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
