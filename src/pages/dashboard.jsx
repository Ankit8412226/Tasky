import React, { useState } from "react";
import {
  FiMenu,
  FiSun,
  FiMoon,
  FiList,
  FiCheckCircle,
  FiClock,
  FiInbox,
  FiX,
  FiPlus,
} from "react-icons/fi";
import { motion } from "framer-motion";

// Sidebar Component
const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: FiInbox, label: "All Tasks", count: 12 },
    { icon: FiClock, label: "In Progress", count: 5 },
    { icon: FiList, label: "Pending", count: 4 },
    { icon: FiCheckCircle, label: "Completed", count: 3 },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 z-30 h-full w-64 
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        flex flex-col
      `}
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            Tasky
          </span>
          <button
            className="ml-auto lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 pt-4 px-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center px-3 py-2 mb-1 rounded-lg
                text-gray-700 dark:text-gray-300 
                hover:bg-gray-100 dark:hover:bg-gray-700
                transition-colors duration-150"
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
              <span
                className="ml-auto bg-gray-100 dark:bg-gray-700 
                px-2 py-1 rounded-full text-xs font-medium"
              >
                {item.count}
              </span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

// Header Component
const Header = ({ isOpen, setIsOpen, darkMode, setDarkMode, setShowModal }) => {
  return (
    <header
      className="fixed top-0 right-0 z-20 h-16 
      bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700
      flex items-center px-4
      w-full lg:w-[calc(100%-16rem)] lg:ml-64"
    >
      <button
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMenu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>

      <button
        className="ml-4 px-4 py-2 flex items-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        onClick={() => setShowModal(true)}
      >
        <FiPlus className="mr-2" /> Add Task
      </button>

      <div className="flex items-center ml-auto space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
            text-gray-500 dark:text-gray-400
            transition-colors duration-150"
        >
          {darkMode ? (
            <FiSun className="w-5 h-5" />
          ) : (
            <FiMoon className="w-5 h-5" />
          )}
        </motion.button>

        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-medium">JD</span>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            John Doe
          </span>
        </div>
      </div>
    </header>
  );
};

// Task Modal Component
const TaskModal = ({ showModal, setShowModal }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    deadline: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Task Created:", task);
    setShowModal(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        showModal ? "visible" : "invisible"
      }`}
    >
      <div
        className="bg-black/50 absolute inset-0"
        onClick={() => setShowModal(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative w-96"
      >
        <button
          className="absolute top-3 right-3"
          onClick={() => setShowModal(false)}
        >
          <FiX size={20} className="text-gray-500" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Create New Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded"
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            required
          />
          <input
            type="date"
            className="w-full p-2 border rounded"
            onChange={(e) => setTask({ ...task, deadline: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Create Task
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// Dashboard Layout
const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setShowModal={setShowModal}
      />
      {showModal && (
        <TaskModal showModal={showModal} setShowModal={setShowModal} />
      )}
      <main className="pt-16 lg:ml-64 min-h-screen">
        <div className="px-4 py-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
