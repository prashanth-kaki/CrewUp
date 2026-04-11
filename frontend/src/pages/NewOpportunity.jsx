import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const NewOpportunity = () => {
  const [teamName, setTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [reqSkills, setReqSkills] = useState('');
  const navigate = useNavigate();

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName) return;
    try {
      const skillsArray = reqSkills.split(',').map(s => s.trim()).filter(s => s);
      const { data } = await api.post('/teams', { 
        name: teamName, 
        description: newTeamDesc, 
        requiredSkills: skillsArray 
      });
      navigate(`/workspace/${data._id}`);
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creating team: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Post a New Project Idea</h2>
      
      <div className="clean-card">
        <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Project Title</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Build a mobile app for campus event" 
              value={teamName} 
              onChange={(e) => setTeamName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="input-field" 
              rows="5"
              placeholder="Describe what you are building..." 
              value={newTeamDesc} 
              onChange={(e) => setNewTeamDesc(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Required Skills (comma separated)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. React, Node, Web3" 
              value={reqSkills} 
              onChange={(e) => setReqSkills(e.target.value)} 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '1rem 2rem', marginTop: '1rem' }}>
            Post Project Idea
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewOpportunity;
