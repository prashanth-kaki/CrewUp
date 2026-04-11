import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Workspace from './pages/Workspace.jsx';
import Profile from './pages/Profile.jsx';
import Explore from './pages/Explore.jsx';
import Landing from './pages/Landing.jsx';
import MyProjects from './pages/MyProjects.jsx';
import NewOpportunity from './pages/NewOpportunity.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="explore" element={<Explore />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-projects" element={<MyProjects />} />
          <Route path="new" element={<NewOpportunity />} />
          <Route path="workspace/:teamId" element={<Workspace />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
