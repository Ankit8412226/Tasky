import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import DashboardLayout from "./pages/dashboard";
import { useState, useEffect, createContext } from "react";
import AllTasks from "./pages/AllTaska"; // Fix the typo
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/Signup";
import PendingTask from "./pages/pendingtask";

export const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or default to light
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Update theme in localStorage and apply class whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  if (token) {
    return <Navigate to={from} replace />;
  }

  return children;
};

// Dashboard Pages



const InProgressTasks = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      In Progress
    </h1>
  </div>
);

const CompletedTasks = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Completed Tasks
    </h1>
  </div>
);

// Dashboard Routes Component
const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="all" element={<AllTasks />} />
        <Route path="pending" element={<PendingTask />} />
        <Route path="in-progress" element={<InProgressTasks />} />
        <Route path="completed" element={<CompletedTasks />} />
        <Route path="" element={<Navigate to="all" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

function App() {
  // Global loading state for initial auth check
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth status
    // You can add your actual auth check logic here
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <SignupPage />
              </AuthRoute>
            }
          />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardRoutes />
              </ProtectedRoute>
            }
          />

          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
