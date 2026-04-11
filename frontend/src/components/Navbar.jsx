import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  
  // Get first letter of name, or 'P' fallback
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'P';

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 2rem',
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      height: '64px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>☰</div>
        <Link to="/" style={{ 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          color: 'var(--primary-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>💼</span> CrewUp
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontSize: '1.2rem' }}>🔔</span>
          <div style={{
            position: 'absolute', top: '-5px', right: '-5px',
            background: '#ef4444', color: 'white', fontSize: '0.6rem',
            width: '16px', height: '16px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>1</div>
        </div>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#f3f4f6', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-main)',
          border: '1px solid var(--border-color)'
        }}>
          {initial}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
