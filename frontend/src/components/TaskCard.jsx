import { Calendar, User as UserIcon, Clock, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

const cn = (...inputs) => twMerge(clsx(inputs));

const TaskCard = ({ task, onUpdateStatus, onDelete, isAdmin }) => {
  const statusColors = {
    TODO: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    IN_PROGRESS: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    DONE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <div className="glass card-hover rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-bold border",
          statusColors[task.status]
        )}>
          {task.status.replace('_', ' ')}
        </span>
        {isAdmin && (
          <button 
            onClick={() => onDelete(task._id)}
            className="text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">{task.title}</h3>
        <p className="text-slate-400 text-sm line-clamp-2">{task.description}</p>
      </div>

      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <UserIcon size={14} />
          <span>{task.assignedTo?.name || 'Unassigned'}</span>
        </div>
        <div className={cn(
          "flex items-center gap-2 text-sm",
          isOverdue ? "text-red-400 font-medium" : "text-slate-400"
        )}>
          <Calendar size={14} />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          {isOverdue && <Clock size={14} className="animate-pulse" />}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        {task.status !== 'TODO' && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdateStatus(task._id, 'TODO')}
            className="flex-1 py-2 rounded-lg bg-slate-800 text-xs font-medium hover:bg-slate-700 transition-colors"
          >
            To Do
          </motion.button>
        )}
        {task.status !== 'IN_PROGRESS' && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdateStatus(task._id, 'IN_PROGRESS')}
            className="flex-1 py-2 rounded-lg bg-amber-600/20 text-amber-400 text-xs font-medium hover:bg-amber-600/30 transition-colors border border-amber-600/20"
          >
            In Progress
          </motion.button>
        )}
        {task.status !== 'DONE' && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdateStatus(task._id, 'DONE')}
            className="flex-1 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 text-xs font-medium hover:bg-emerald-600/30 transition-colors border border-emerald-600/20"
          >
            Done
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
