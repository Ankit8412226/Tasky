import React, { useState, useRef } from "react";
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
  FiUpload,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard/all", icon: FiInbox, label: "All Tasks" },
    { path: "/dashboard/in-progress", icon: FiClock, label: "In Progress" },
    { path: "/dashboard/pending", icon: FiList, label: "Pending" },
    { path: "/dashboard/completed", icon: FiCheckCircle, label: "Completed" },
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
        className={`fixed top-0 left-0 z-30 h-full w-64 
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        flex flex-col shadow-lg`}
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
    <Link
      to={item.path}
      key={index}
      className="block w-full"
    >
      <div
        className="w-full flex items-center px-3 py-2 mb-1 rounded-lg
          text-gray-700 dark:text-gray-300 
          hover:bg-gray-100 dark:hover:bg-gray-700
          transition-colors duration-150"
      >
        <item.icon className="w-5 h-5 mr-3" />
        <span>{item.label}</span>
      </div>
    </Link>
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
      flex items-center px-4 w-full lg:w-[calc(100%-16rem)] lg:ml-64 shadow-md"
    >
      <button
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMenu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>

      <button
        className="ml-4 px-4 py-2 flex items-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      setTask({ ...task, image: file });
      setPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", task.title);
      formData.append("description", task.description);
      formData.append("status", task.status);
      formData.append("deadline", task.deadline);
      if (task.image) {
        formData.append("image", task.image);
      }
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://taskybackend-gmpn.onrender.com/api/v1/task/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in Authorization header
          },
        }
      );

      console.log("Task Created:", response.data);
      setShowModal(false);
      setTask({
        title: "",
        description: "",
        status: "pending",
        deadline: "",
        image: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create New Task
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Task title"
                    className="w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={task.title}
                    onChange={(e) =>
                      setTask({ ...task, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Task description"
                    rows="3"
                    className="w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={task.description}
                    onChange={(e) =>
                      setTask({ ...task, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={task.status}
                    onChange={(e) =>
                      setTask({ ...task, status: e.target.value })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deadline
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={task.deadline}
                      onChange={(e) =>
                        setTask({ ...task, deadline: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Task Image
                  </label>
                  <div
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="space-y-1 text-center">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                      ) : (
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                    <FiAlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Create Task"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
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
