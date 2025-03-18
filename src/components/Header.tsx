
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, HelpCircle, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logoutUser, isAuthenticated, getCurrentUser } from '@/utils/api';
import { toast } from 'sonner';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            <h1 className="text-2xl font-bold">ExpenseTracker</h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            className="flex items-center gap-2"
            size="sm"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </Button>
          
          {authenticated && (
            <nav className="hidden md:block">
              <ul className="flex gap-6">
                <li><Link to="/" className="hover:underline">Dashboard</Link></li>
                <li><Link to="#" className="hover:underline">Transactions</Link></li>
                <li><Link to="#" className="hover:underline">Reports</Link></li>
                <li><Link to="#" className="hover:underline">Settings</Link></li>
              </ul>
            </nav>
          )}
          
          {authenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-block text-white">
                <User className="h-4 w-4 inline mr-1" /> {currentUser?.name}
              </span>
              <Button 
                variant="outline" 
                className="bg-transparent border border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="bg-transparent border border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              size="sm"
              onClick={() => navigate('/login')}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
          
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
