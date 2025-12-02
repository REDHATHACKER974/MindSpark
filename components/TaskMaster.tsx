
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckSquare, Plus, Trash2, ChevronLeft, ChevronRight, Filter, Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { Task, TaskCategory, GamificationProps } from '../types';

const CATEGORIES: TaskCategory[] = ['Study', 'Personal', 'Work', 'Other'];

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Study: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
  Personal: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
  Work: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-700',
  Other: 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300 border-slate-200 dark:border-slate-600',
};

const TaskMaster: React.FC<GamificationProps> = ({ onReward }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Complete Math Assignment', completed: false, date: new Date().toISOString(), category: 'Study' },
    { id: '2', text: 'Read History Chapter 4', completed: true, date: new Date().toISOString(), category: 'Study' },
    { id: '3', text: 'Buy groceries', completed: false, date: new Date().toISOString(), category: 'Personal' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Study');
  const [filter, setFilter] = useState<TaskCategory | 'All'>('All');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Focus Flow State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [mode, setMode] = useState<'Focus' | 'Break'>('Focus');

  useEffect(() => {
    let interval: number;
    if (timerActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      // Play sound or notify
      if (mode === 'Focus') {
          onReward(50, "Focus Session Complete! +50 XP");
          setMode('Break');
          setTimeLeft(5 * 60);
      } else {
          setMode('Focus');
          setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, mode, onReward]);

  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => {
    setTimerActive(false);
    setMode('Focus');
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      date: currentDate.toISOString(),
      category: newCategory
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const isNowCompleted = !t.completed;
        // Gamification Reward for completion
        if (isNowCompleted) {
            onReward(10, "Task Completed! +10 XP");
        }
        return { ...t, completed: isNowCompleted };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => filter === 'All' ? true : t.category === filter);

  const getCategoryCount = (cat: TaskCategory | 'All') => {
    if (cat === 'All') return tasks.length;
    return tasks.filter(t => t.category === cat).length;
  };

  // Simple Calendar Logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto">
      {/* Task List (Left 2 cols) */}
      <div className="lg:col-span-2 dark:bg-slate-800 bg-white rounded-xl border dark:border-slate-700 border-slate-200 p-6 flex flex-col min-h-[500px]">
        <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-6 flex items-center gap-2">
            <CheckSquare className="text-emerald-500" />
            Checklist
        </h2>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <Filter size={16} className="text-slate-400 mr-1 flex-shrink-0" />
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${filter === 'All' ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'}`}
          >
            All <span className="opacity-60 text-[10px] bg-black/10 dark:bg-black/20 px-1.5 rounded-full">{getCategoryCount('All')}</span>
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap border flex items-center gap-1 ${filter === cat ? CATEGORY_COLORS[cat] : 'border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'}`}
            >
              {cat} <span className="opacity-60 text-[10px] bg-black/5 dark:bg-white/10 px-1.5 rounded-full">{getCategoryCount(cat)}</span>
            </button>
          ))}
        </div>
        
        {/* Input Area */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <div className="flex-1 flex gap-2">
              <input 
                  type="text" 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Add a new task..."
                  className="flex-1 dark:bg-slate-900 bg-slate-50 border dark:border-slate-600 border-slate-300 rounded-lg px-4 py-2 dark:text-white text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                className="dark:bg-slate-900 bg-slate-50 border dark:border-slate-600 border-slate-300 rounded-lg px-3 py-2 dark:text-white text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <button 
                  onClick={addTask}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                  <Plus size={20} />
              </button>
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2">
            {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                  <CheckSquare size={48} className="mb-2 opacity-20" />
                  <p>No tasks found.</p>
                </div>
            )}
            {filteredTasks.map(task => (
                <div key={task.id} className="group flex items-center gap-3 dark:bg-slate-900/50 bg-slate-50 p-3 rounded-lg border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                    <button 
                        onClick={() => toggleTask(task.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-400 dark:border-slate-500 hover:border-emerald-500'}`}
                    >
                        {task.completed && <CheckSquare size={14} className="text-white" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center gap-2 mb-1 ${task.completed ? 'opacity-50' : ''}`}>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[task.category]}`}>
                          {task.category}
                        </span>
                      </div>
                      <p className={`truncate dark:text-slate-200 text-slate-800 ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                          {task.text}
                      </p>
                    </div>

                    <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
      </div>

      {/* Sidebar (Right Col): Focus Flow & Calendar */}
      <div className="flex flex-col gap-6">
        
        {/* Focus Flow Timer */}
        <div className="dark:bg-slate-800 bg-white rounded-xl border dark:border-slate-700 border-slate-200 p-6 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${timerActive ? 'animate-linear-progress bg-red-500' : 'bg-transparent'}`}></div>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 mb-4 flex items-center gap-2">
                <Timer className="text-red-500" />
                Focus Flow
            </h2>
            
            <div className="flex flex-col items-center justify-center mb-6">
                <div className={`text-5xl font-mono font-bold mb-2 ${timerActive ? 'text-red-500' : 'dark:text-slate-200 text-slate-800'}`}>
                    {formatTime(timeLeft)}
                </div>
                <span className={`text-sm uppercase tracking-widest font-semibold ${mode === 'Focus' ? 'text-slate-500' : 'text-emerald-500'}`}>
                    {mode} Mode
                </span>
            </div>

            <div className="flex justify-center gap-4">
                <button 
                    onClick={toggleTimer}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-white transition-all transform hover:scale-105 ${timerActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'}`}
                >
                    {timerActive ? <Pause size={18} /> : <Play size={18} />}
                    {timerActive ? 'Pause' : 'Start'}
                </button>
                <button 
                    onClick={resetTimer}
                    className="p-2 rounded-full dark:bg-slate-700 bg-slate-100 text-slate-500 hover:text-red-500 transition-colors"
                >
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>

        {/* Calendar */}
        <div className="dark:bg-slate-800 bg-white rounded-xl border dark:border-slate-700 border-slate-200 p-6 flex flex-col flex-1">
            <h2 className="text-xl font-bold dark:text-white text-slate-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="text-orange-500" />
                Calendar
            </h2>

            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><ChevronLeft className="dark:text-slate-300 text-slate-600" size={16} /></button>
                <h3 className="text-md font-bold dark:text-white text-slate-800">{monthName} {currentDate.getFullYear()}</h3>
                <button onClick={nextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><ChevronRight className="dark:text-slate-300 text-slate-600" size={16} /></button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-xs font-bold text-slate-400">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 flex-1">
                {[...Array(firstDayOfMonth)].map((_, i) => (
                    <div key={`empty-${i}`} className="p-1"></div>
                ))}
                {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
                    
                    const hasTask = tasks.some(t => {
                    const tDate = new Date(t.date || '');
                    return tDate.getDate() === day && tDate.getMonth() === currentDate.getMonth() && !t.completed;
                    });

                    return (
                        <div 
                            key={day} 
                            className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 relative ${isToday ? 'bg-orange-600 text-white font-bold' : 'dark:bg-slate-900/30 bg-slate-50 dark:text-slate-300 text-slate-700'}`}
                        >
                            {day}
                            {hasTask && !isToday && (
                            <div className="w-1 h-1 bg-emerald-500 rounded-full mt-0.5"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TaskMaster;
