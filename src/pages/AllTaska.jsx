import { useEffect, useState } from "react";
import { useDrop, useDrag, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { FiEdit, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";

const AllTask = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "https://taskybackend-nwza.onrender.com/api/tasks"
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `https://taskybackend-nwza.onrender.com/api/tasks/${taskId}`,
        { status: newStatus }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(
        `https://taskybackend-nwza.onrender.com/api/tasks/${taskId}`
      );
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 min-h-screen w-full">
        {["pending", "in-progress", "completed"].map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            updateTaskStatus={updateTaskStatus}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </DndProvider>
  );
};

const TaskColumn = ({ status, tasks, updateTaskStatus, deleteTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => updateTaskStatus(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`p-4 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800 transition-all w-full ${
        isOver ? "ring-4 ring-blue-500" : ""
      }`}
    >
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 capitalize">
        {status.replace("-", " ")}
      </h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} deleteTask={deleteTask} />
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({ task, deleteTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 rounded-lg shadow-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex justify-between items-center transition-all w-full ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {task.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {task.description}
        </p>
      </div>
      <div className="flex space-x-2">
        <button className="text-blue-500 hover:text-blue-700">
          <FiEdit size={16} />
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => deleteTask(task._id)}
        >
          <FiTrash size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default AllTask;
