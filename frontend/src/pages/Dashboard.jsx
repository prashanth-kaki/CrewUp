import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [myProjectsCount, setMyProjectsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpportunities();
    fetchMyProjects();
  }, []);

  const fetchOpportunities = async () => {
    try {
      // Just fetching all teams as placeholder for recommended
      const { data } = await api.get('/teams');
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyProjects = async () => {
    // Basic calculation for stats row
    try {
      const { data } = await api.get('/teams');
      const myProjs = data.filter(t => t.owner === user?._id || t.members.some(m => (m._id || m) === user?._id));
      setMyProjectsCount(myProjs.length);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        background: 'var(--primary-color)', 
        color: 'white', 
        padding: '2rem', 
        borderRadius: '1rem',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back, {user?.name}!</h1>
        <p style={{ opacity: 0.9 }}>Here's what's happening. Browse projects, join teams, and start collaborating.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Total Opportunities</p>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>💼</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>{projects.length}</h2>
        </div>
        <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Your Projects</p>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>📁</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>{myProjectsCount}</h2>
        </div>
        <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Pending Requests</p>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>🔔</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>1</h2>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem', color: '#f59e0b' }}>⭐</span>
        <h2 style={{ fontSize: '1.4rem' }}>Recommended For You</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {projects.map(project => (
          <div key={project._id} className="clean-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '0.2rem' }}>{project.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              by <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>Admin</span>
            </p>
            
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1 }}>
              {project.description || 'No description provided.'}
            </p>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {(project.requiredSkills || []).map(skill => (
                <span key={skill} style={{ background: 'var(--pill-bg-dark)', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '500' }}>
                  {skill}
                </span>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                👥 {project.members?.length || 0} Member{(project.members?.length !== 1) ? 's' : ''}
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <span style={{ background: '#f3f4f6', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>D</span>
                <span style={{ background: '#f3f4f6', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>P</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
