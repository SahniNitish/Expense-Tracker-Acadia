
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Calendar, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Transaction } from '@/utils/types';
import { format } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTransactions, fetchCategories, deleteTransaction } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const TransactionList: React.FC = () => {
  const queryClient = useQueryClient();
  
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

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      
      // Refresh all relevant data
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['monthlySummary'] });
      
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  if (transactionsLoading || categoriesLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-6">
          <div className="flex justify-center">
            <p>Loading transactions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Transactions
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="transaction-list">
          {transactions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No transactions found. Add one to get started!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: getCategoryColor(transaction.category) }} 
                          />
                          {transaction.category}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div className={`flex items-center justify-end gap-1 ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpCircle className="h-4 w-4" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4" />
                          )}
                          ${transaction.amount.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleDelete(transaction.id)} 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
