import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const { data } = await api.get('/teams/explore');
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoin = async (id) => {
    try {
      await api.post(`/teams/${id}/join`);
      alert('Joined project successfully!');
      fetchMatches(); 
    } catch (error) {
      console.error(error);
      alert('Failed to join project');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Explore Opportunities</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Projects matching your skills are ranked higher by our matching engine.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {projects.map((project) => (
          <div key={project._id} className="clean-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{project.name}</h3>
              {project.matchScore !== undefined && (
                <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', padding: '0.3rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '600' }}>
                  {Math.round(project.matchScore)}% Match
                </span>
              )}
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              by Admin
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                👥 {project.members?.length || 0} Member{(project.members?.length !== 1) ? 's' : ''}
              </div>
              <button 
                className="btn-primary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} 
                onClick={() => handleJoin(project._id)}
              >
                Join Project
              </button>
            </div>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="clean-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No open projects found. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
