import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/taskAPI';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Search, Filter, CheckSquare } from 'lucide-react';

const extractTasksList = (res) => {
  if (!res) return [];
  const val = res.data !== undefined ? res.data : res;
  if (Array.isArray(val?.tasks)) return val.tasks;
  if (Array.isArray(val)) return val;
  return [];
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await taskAPI.getTasks();
      setTasks(extractTasksList(res));
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTask) {
        await taskAPI.updateTask(editingTask._id, formData);
      } else {
        await taskAPI.createTask(formData);
      }
      setIsFormOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      alert('Failed to save task: ' + err.message);
    }
  };

  const handleToggleComplete = async (task) => {
    if (!task || !task._id) return;
    try {
      await taskAPI.updateTask(task._id, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(id);
        fetchTasks();
      } catch (err) {
        alert('Failed to delete task: ' + err.message);
      }
    }
  };

  const handleStartSession = (taskId) => {
    navigate('/sessions', { state: { taskId } });
  };

  // Filter & Search logic with defensive checks
  const safeTasksList = Array.isArray(tasks) ? tasks : [];
  const filteredTasks = safeTasksList.filter((t) => {
    if (!t || !t.title) return false;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.subject && t.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      filterStatus === 'All'
        ? true
        : filterStatus === 'Completed'
        ? t.completed
        : !t.completed;

    const matchesPriority =
      filterPriority === 'All' ? true : t.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-8">
      {/* Header & New Task Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">Study Task Management</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize assignments, exams, and project milestones with priority flags.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsFormOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-glow-purple transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus size={16} />
          Create New Task
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full flex items-center">
          <Search size={18} className="absolute left-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or subject..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-purple-500 flex-1 md:flex-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Pending Tasks</option>
            <option value="Completed">Completed Tasks</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-purple-500 flex-1 md:flex-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching task list..." />
      ) : filteredTasks.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-3 text-2xl">
            📝
          </div>
          <h4 className="font-display font-bold text-slate-200">No Tasks Found</h4>
          <p className="text-xs text-slate-400 mt-1 mb-4">No tasks match your filter criteria or search query.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('All');
              setFilterPriority('All');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={(t) => {
                setEditingTask(t);
                setIsFormOpen(true);
              }}
              onDelete={handleDelete}
              onStartSession={handleStartSession}
            />
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialTask={editingTask}
      />
    </div>
  );
}
