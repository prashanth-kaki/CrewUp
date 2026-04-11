import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MyProjects = () => {
  const [teams, setTeams] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, [user]);

  const fetchTeams = async () => {
    try {
      const { data } = await api.get('/teams');
      setTeams(data.filter(t => t.owner === user?._id || t.members.some(m => (m._id || m) === user?._id)));
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>My Projects</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Projects you have created or joined.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {teams.map((team) => (
          <div 
            key={team._id} 
            className="clean-card"
            style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column' }}
            onClick={() => navigate(`/workspace/${team._id}`)}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>{team.name}</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1 }}>
              {team.description || 'No description provided.'}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                👥 Members: {team.members.length}
              </div>
              <div style={{ fontWeight: '500', color: 'var(--primary-color)' }}>
                Enter Workspace →
              </div>
            </div>
          </div>
        ))}
        {teams.length === 0 && (
          <div className="clean-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>You are not part of any projects yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
