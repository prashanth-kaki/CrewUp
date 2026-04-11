import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';

const Workspace = () => {
  const { teamId } = useParams();
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [resources, setResources] = useState([]);
  const [file, setFile] = useState(null);

  // Chat tracking
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    fetchTeamData();
    fetchResources();

    // Socket connectivity
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join_team', teamId);

    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${teamId}`);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    socketRef.current.on('receive_message', (message) => {
      setMessages((prev) => {
        if (prev.some(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [teamId]);

  const fetchTeamData = async () => {
    const { data } = await api.get(`/teams/${teamId}`);
    setTeam(data);
  };

  const fetchResources = async () => {
    const { data } = await api.get(`/resources/team/${teamId}`);
    setResources(data);
  };

  const handleFileUploadDirect = async (selectedFile) => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('teamId', teamId);
    try {
      const { data } = await api.post('/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResources([...resources, data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await api.post(`/messages/${teamId}`, {
        content: newMessage
      });
      socketRef.current.emit('send_message', data);
      setMessages((prev) => [...prev, data]);
      setNewMessage('');
    } catch (error) {
      console.error(error);
      alert('Error sending message. Check console.');
    }
  };

  if (!team) return <div style={{ padding: '2rem' }}>Loading project details...</div>;

  const isOwner = (team.owner?._id || team.owner) === user?._id;

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Banner mapping to Img3 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>{team.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Project posted by <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{team.owner?.name || 'Admin'}</span></p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.6', marginTop: '1rem', color: 'var(--text-main)' }}>
            {team.description || "We're building a modern collaboration app for university students to manage group projects, track tasks, chat, and share resources in real time."}
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {isOwner && (
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-main)' }}>
              You are the owner
            </div>
          )}

          <div className="clean-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>💼</span> Needed Skills & Roles
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Skills</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(team.requiredSkills?.length ? team.requiredSkills : ['react', 'python', 'cloud']).map(skill => (
                  <span key={skill} style={{ background: 'var(--pill-bg-dark)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '500' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Roles</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--pill-bg-light)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '500' }}>frontend</span>
                <span style={{ background: 'var(--pill-bg-light)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '500' }}>backend</span>
              </div>
            </div>
          </div>
          
          <div className="clean-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>👤</span> Team Members ({team.members.length})
            </h3>
            {team.members.map((member, idx) => (
               <div key={idx} style={{ padding: '0.5rem 0', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                   {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
                 </div>
                 {member.name || `Member ${idx + 1}`}
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* Files Section matching Img4 */}
      <div className="clean-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem' }}>Project Files</h2>
          <label style={{ cursor: 'pointer', background: 'var(--primary-color)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background-color 0.2s' }}>
            <span>📤</span> Upload File
            <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileUploadDirect(e.target.files[0])} />
          </label>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem', fontWeight: '500' }}>Name</th>
                <th style={{ padding: '1rem', fontWeight: '500', textAlign: 'center' }}>Uploader</th>
                <th style={{ padding: '1rem', fontWeight: '500', textAlign: 'center' }}>Date</th>
                <th style={{ padding: '1rem', fontWeight: '500', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No files have been uploaded yet.
                  </td>
                </tr>
              ) : (
                resources.map(res => (
                  <tr key={res._id} style={{ borderBottom: '1px solid var(--bg-main)' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{res.name}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>System</td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Today</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <a href={res.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Download</a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Chat Section */}
      <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>💬</span> Team Chat
        </h2>
        
        <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: 'auto' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>👋</span>
              No messages yet. Say hi to your team!
            </div>
          ) : (
            messages.map((msg, index) => {
               const isMe = msg.sender?._id === user?._id;
               return (
                 <div key={index} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', background: isMe ? 'var(--primary-color)' : 'white', color: isMe ? 'white' : 'var(--text-main)', padding: '0.8rem 1rem', borderRadius: '1rem', borderBottomRightRadius: isMe ? '0' : '1rem', borderBottomLeftRadius: isMe ? '1rem' : '0', maxWidth: '75%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: isMe ? 'none' : '1px solid var(--border-color)' }}>
                   {!isMe && <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.3rem', color: 'var(--primary-color)' }}>{msg.sender?.name || 'Unknown'}</div>}
                   <div style={{ lineHeight: '1.4' }}>{msg.content}</div>
                 </div>
               )
            })
          )}
        </div>

        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Type your message here..." 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)} 
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 2rem' }}>Send</button>
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button style={{ width: '100%', padding: '1.2rem', background: 'var(--pill-bg-light)', color: 'white', borderRadius: '0.8rem', fontSize: '1.2rem', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <span>👤</span> You're on the team
        </button>
      </div>

    </div>
  );
};

export default Workspace;
