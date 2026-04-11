import { useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext.jsx';


const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    skills: '',
    interests: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setProfile({
        name: data.name || '',
        bio: data.bio || '',
        skills: data.skills ? data.skills.join(', ') : '',
        interests: data.interests ? data.interests.join(', ') : ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...profile,
        skills: profile.skills.split(',').map(s => s.trim()).filter(s => s),
        interests: profile.interests.split(',').map(s => s.trim()).filter(s => s)
      };
      await api.put('/auth/profile', formattedData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Your Profile</h2>
      <div className="clean-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Bio</label>
              <textarea 
                className="input-field" 
                rows="4"
                value={profile.bio}
                onChange={e => setProfile({...profile, bio: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Skills (comma separated)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. React, Node, Design"
                value={profile.skills}
                onChange={e => setProfile({...profile, skills: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Interests (comma separated)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. AI, Open Source, Gaming"
                value={profile.interests}
                onChange={e => setProfile({...profile, interests: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Profile</button>
          </form>
      </div>
    </div>
  );
};

export default Profile;
