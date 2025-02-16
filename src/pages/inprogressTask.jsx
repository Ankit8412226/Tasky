import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Edit2, Clock, AlertCircle, ChevronDown, 
  X, Loader, Calendar, CheckCircle, Timer 
} from 'lucide-react';
import axios from "axios";

const TaskManager = () => {
  const [state, setState] = useState({
    tasks: [],
    isLoading: true,
    error: null,
    editingId: null,
    isUpdating: false,
    editForm: null,
    dropdownOpen: null
  });

  const dropdownRef = useRef(null);
  const token = localStorage.getItem('token');
  const API_BASE_URL = 'https://taskybackend-gmpn.onrender.com/api/v1';

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchTasks();
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setState(prev => ({ ...prev, dropdownOpen: null }));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTasks = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data } = await api.get('/task/in-progress');
      setState(prev => ({ ...prev, tasks: data, isLoading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message, isLoading: false }));
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/task/${taskId}`);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.taskId !== taskId)
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to delete task' }));
    }
  };

  const updateTask = async (taskId, updates) => {
    setState(prev => ({ ...prev, isUpdating: true }));
    try {
      await api.put(`/task/${taskId}`, updates);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.taskId === taskId ? { ...task, ...updates } : task
        ),
        editForm: null,
        dropdownOpen: null
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to update task', isUpdating: false }));
    } finally {
      setState(prev => ({ ...prev, isUpdating: false }));
    }
  };

  const statusOptions = [
    { value: 'pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', hoverBg: 'hover:bg-amber-100' },
    { value: 'in-progress', icon: Timer, color: 'text-blue-600', bg: 'bg-blue-50', hoverBg: 'hover:bg-blue-100' },
    { value: 'completed', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-100' }
  ];

  const getStatusDetails = (status) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const TaskCard = ({ task }) => {
    const statusDetail = getStatusDetails(task.status);
    const dropdownContainerRef = useRef(null);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className=" rounded-xl shadow-lg  border border-gray-200 hover:shadow-xl transition-all duration-300"
      >
        {state.editForm?.taskId === task.taskId ? (
          <EditForm task={task} />
        ) : (
          <ViewMode task={task} statusDetail={statusDetail} dropdownContainerRef={dropdownContainerRef} />
        )}
      </motion.div>
    );
  };

  const EditForm = ({ task }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        updateTask(task._id, state.editForm);
      }}>
        <input
          type="text"
          value={state.editForm.title}
          onChange={(e) => setState(prev => ({
            ...prev,
            editForm: { ...prev.editForm, title: e.target.value }
          }))}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
          placeholder="Task title"
        />
        <textarea
          value={state.editForm.description}
          onChange={(e) => setState(prev => ({
            ...prev,
            editForm: { ...prev.editForm, description: e.target.value }
          }))}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 resize-none"
          placeholder="Task description"
          rows="3"
        />
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setState(prev => ({ ...prev, editForm: null }))}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            disabled={state.isUpdating}
          >
            {state.isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </motion.div>
  );

  const ViewMode = ({ task, statusDetail, dropdownContainerRef }) => (
    <>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {task.title}
            </h3>
            <p className="text-gray-600 dark:text-white">
              {task.description}
            </p>
          </div>
          <div className="flex space-x-2 ml-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setState(prev => ({
                ...prev,
                editForm: { taskId: task.taskId, ...task }
              }))}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => deleteTask(task._id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="relative inline-block" ref={dropdownContainerRef}>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setState(prev => ({ 
                ...prev, 
                dropdownOpen: prev.dropdownOpen === task.taskId ? null : task.taskId 
              }));
            }}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${statusDetail.bg} ${statusDetail.color} hover:bg-opacity-80 transition-all duration-200`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <statusDetail.icon className="w-4 h-4 mr-2" />
            <span className="capitalize">{task.status}</span>
            <motion.div
              animate={{ rotate: state.dropdownOpen === task.taskId ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="ml-2 w-4 h-4" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {state.dropdownOpen === task.taskId && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-full mt-1 w-48 rounded-lg shadow-lg  border border-gray-200 overflow-hidden z-500"
                ref={dropdownRef}
              >
                <div className=" overflow-y-auto">
                  {statusOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => updateTask(task._id, { status: option.value })}
                      className={`w-full text-left px-4 py-3 text-sm ${option.color} ${option.hoverBg} flex items-center transition-colors duration-200`}
                      whileHover={{ x: 4 }}
                    >
                      <option.icon className="w-4 h-4 mr-2" />
                      <span className="capitalize">{option.value}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
          Due: {new Date(task.deadline).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>
    </>
  );

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="p-4"
        >
          <Loader className="w-12 h-12 text-indigo-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen   p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center ">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          In-progress Task
          </h1>
      
        </div>

        <AnimatePresence>
          {state.error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{state.error}</p>
                <button 
                  onClick={() => setState(prev => ({ ...prev, error: null }))}
                  className="ml-auto hover:bg-red-100 p-1.5 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {state.tasks.map(task => (
              <TaskCard key={task.taskId} task={task} />
            ))}
          </AnimatePresence>
        </div>

        {state.tasks.length === 0 && !state.error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16  rounded-xl shadow-sm border border-gray-200"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mx-auto w-16 h-16 text-gray-400"
            >
              <Clock className="w-full h-full" />
            </motion.div>
            <h3 className="mt-6 text-xl font-medium text-gray-900">No Tasks Available</h3>
            <p className="mt-2 text-gray-600">Create your first task to get started</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TaskManager;