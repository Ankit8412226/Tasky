import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiMail,
  FiLock,
  FiUser,
  FiSun,
  FiMoon,
  FiLogIn,
  FiUserPlus,
  FiChevronRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = React.useContext(ThemeContext);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setDarkMode(!darkMode)}
      className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 
        shadow-md hover:shadow-lg transition-all duration-300 z-50"
    >
      {darkMode ? (
        <FiSun className="w-5 h-5" />
      ) : (
        <FiMoon className="w-5 h-5" />
      )}
    </motion.button>
  );
};

const Input = ({ icon: Icon, error, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
      <Icon className="w-5 h-5" />
    </div>
    <input
      {...props}
      className={`pl-10 w-full py-2.5 px-3 text-base border rounded-lg
      bg-white dark:bg-gray-800 
      text-gray-900 dark:text-gray-100
      placeholder-gray-400 dark:placeholder-gray-500
      ${
        error
          ? "border-red-300 dark:border-red-700 focus:border-red-500"
          : "border-gray-200 dark:border-gray-700 focus:border-blue-500"
      }
      focus:outline-none focus:ring-1 focus:ring-blue-500
      transition-colors duration-200`}
    />
  </div>
);

const Button = ({ children, loading, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    {...props}
    className="w-full flex justify-center items-center gap-2 py-2.5 px-4 
      rounded-lg text-base font-medium text-white 
      bg-gradient-to-r from-blue-600 to-blue-500 
      hover:from-blue-700 hover:to-blue-600 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      disabled:opacity-50 shadow-md
      transition-all duration-200 cursor-pointer"
  >
    {loading ? (
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
    ) : (
      children
    )}
  </motion.button>
);

const AuthPage = ({ isLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin
        ? "https://taskybackend-nwza.onrender.com/api/v1/auth/login"
        : "https://taskybackend-nwza.onrender.com/api/v1/auth/register";
      const response = await axios.post(endpoint, formData);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isLogin ? "Invalid credentials" : "Failed to create account")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div
      className="h-screen flex items-center justify-center
      bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 
      transition-colors duration-300"
    >
      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-4"
      >
        <div className="flex flex-col items-center space-y-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-400 
              rounded-xl shadow-md flex items-center justify-center"
          >
            <h1 className="text-2xl font-bold text-white">T</h1>
          </motion.div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLogin ? "Welcome back" : "Join Tasky"}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {isLogin
                ? "Let's pick up where you left off"
                : "Start organizing your tasks today"}
            </p>
          </div>
        </div>

        <div
          className="bg-white dark:bg-gray-800 p-5 
          shadow-md rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <Input
                    icon={FiUser}
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <Input
                icon={FiMail}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <Input
                icon={FiLock}
                type="password"
                name="password"
                placeholder={isLogin ? "Enter password" : "Create password"}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 
                  p-2.5 rounded-lg border border-red-100 dark:border-red-800"
              >
                {error}
              </motion.div>
            )}

            <Button type="submit" loading={loading}>
              {!loading && (
                <>
                  {isLogin ? (
                    <FiLogIn className="w-5 h-5" />
                  ) : (
                    <FiUserPlus className="w-5 h-5" />
                  )}
                  {isLogin ? "Sign in" : "Create account"}
                  <FiChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>

            <div className="pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    {isLogin ? "New to Tasky?" : "Already have an account?"}
                  </span>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(isLogin ? "/signup" : "/login")}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-4 
                  border border-gray-200 dark:border-gray-700 rounded-lg
                  text-base font-medium text-gray-700 dark:text-gray-200
                  hover:border-blue-500 dark:hover:border-blue-400 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-colors duration-200"
              >
                {isLogin ? "Create an account" : "Sign in to your account"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export const LoginPage = () => <AuthPage isLogin />;
export const SignupPage = () => <AuthPage isLogin={false} />;
