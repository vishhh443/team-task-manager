import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, User, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
        <CheckSquare className="text-violet-400" />
        TeamTask
      </Link>
      
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
        
        <div className="h-6 w-px bg-white/10" />
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-white">{user.name}</span>
            <span className="text-xs text-slate-400">{user.role}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
          <button 
            onClick={handleLogout}
            className="ml-2 p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-all"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
