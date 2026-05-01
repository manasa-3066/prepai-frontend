import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import SkillGap from "./pages/SkillGap";
import ChatBot from "./pages/ChatBot";
import Profile from "./pages/Profile";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing has its own navbar built in */}
        <Route path="/" element={<Landing />} />

        {/* Auth pages — no main navbar */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected pages — main navbar shown */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Navbar /><Dashboard />
          </ProtectedRoute>
        }/>
        <Route path="/interview" element={
          <ProtectedRoute>
            <Navbar /><Interview />
          </ProtectedRoute>
        }/>
        <Route path="/skillgap" element={
          <ProtectedRoute>
            <Navbar /><SkillGap />
          </ProtectedRoute>
        }/>
        <Route path="/chatbot" element={
          <ProtectedRoute>
            <Navbar /><ChatBot />
          </ProtectedRoute>
        }/>
        <Route path="/profile" element={
          <ProtectedRoute>
            <Navbar /><Profile />
          </ProtectedRoute>
        }/>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;