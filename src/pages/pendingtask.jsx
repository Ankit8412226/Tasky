import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';

const PendingTask = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://taskybackend-gmpn.onrender.com/api/v1/task?status=pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [token]);

  const openModal = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const updateTaskStatus = async () => {
    if (!selectedTask) return;
    try {
      await axios.put(`https://taskybackend-hpaf.onrender.com/api/v1/task/${selectedTask.taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map(task => (task.taskId === selectedTask.taskId ? { ...task, status: newStatus } : task)));
      closeModal();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-300 to-indigo-600 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Pending Tasks</h1>
        <ul className="space-y-4">
          {tasks.map(task => (
            <motion.li 
              key={task.taskId} 
              className="flex flex-col p-6 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200"
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 20 }}
            >
              <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className={`text-sm font-medium ${task.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>Status: {task.status}</span>
                <span className="text-sm text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                <motion.button 
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  onClick={() => openModal(task)}
                  whileHover={{ scale: 1.05 }}
                >
                  Update
                </motion.button>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Modal for Updating Status */}
      <Dialog open={isModalOpen} onClose={closeModal} className="fixed inset-0 flex items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full">
          <Dialog.Title className="text-xl font-bold mb-4 text-gray-900">Update Task Status</Dialog.Title>
          <select 
            value={newStatus} 
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex justify-end space-x-4">
            <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
            <button onClick={updateTaskStatus} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Update</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PendingTask;
