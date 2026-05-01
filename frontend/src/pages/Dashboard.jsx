import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ProjectModal from '../components/ProjectModal';
import { Plus, Filter, Layout, ListChecks, AlertCircle, CheckSquare, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// Simple ClockIcon placeholder
const ClockIcon = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/projects'),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}/status`, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'ALL') return true;
    if (filter === 'OVERDUE') {
      return new Date(task.dueDate) < new Date() && task.status !== 'DONE';
    }
    return task.status === filter;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: tasks.filter(t => t.status === 'DONE').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'DONE').length,
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Hello, {user.name} 👋
          </h1>
          <p className="text-slate-400">
            {user.role === 'ADMIN' 
              ? "Here's what's happening across all projects." 
              : "Here are your assigned tasks for today."}
          </p>
        </div>
        
        {user.role === 'ADMIN' && (
          <div className="flex gap-4">
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Layout size={18} />
              New Project
            </button>
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2"
            >
              <Plus size={18} />
              Assign Task
            </button>
          </div>
        )}
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Tasks', value: stats.total, icon: ListChecks, color: 'text-violet-400' },
          { label: 'In Progress', value: stats.inProgress, icon: ClockIcon, color: 'text-amber-400' },
          { label: 'Completed', value: stats.done, icon: CheckSquare, color: 'text-emerald-400' },
          { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-red-400' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="glass p-6 rounded-2xl border border-white/5 cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={stat.color} size={24} />
              <motion.span 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white"
              >
                {stat.value}
              </motion.span>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
        <Filter size={18} className="text-slate-500 shrink-0" />
        {['ALL', 'TODO', 'IN_PROGRESS', 'DONE', 'OVERDUE'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
              filter === f 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" 
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            )}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              key={task._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <TaskCard 
                task={task} 
                isAdmin={user.role === 'ADMIN'}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteTask}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredTasks.length === 0 && (
        <div className="glass rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-dashed border-white/10">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <ListChecks className="text-slate-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No tasks found</h3>
          <p className="text-slate-400 max-w-xs">
            There are no tasks matching your current filter. Start by creating a new task.
          </p>
        </div>
      )}

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onCreated={fetchData}
        projects={projects}
      />
      <ProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        onCreated={fetchData}
      />
    </div>
  );
};


export default Dashboard;
