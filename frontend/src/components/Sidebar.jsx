import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const links = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Explore', path: '/explore' },
    { label: 'My Projects', path: '/my-projects' },
    { label: 'New Opportunity', path: '/new' },
    { label: 'My Profile', path: '/profile' }
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--bg-sidebar)',
      color: 'var(--text-light)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
    }}>
      <div style={{ flexGrow: 1, paddingTop: '1rem' }}>
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              display: 'block',
              padding: '1rem 1.5rem',
              color: location.pathname === link.path ? 'var(--text-light)' : 'rgba(255,255,255,0.7)',
              backgroundColor: location.pathname === link.path ? 'var(--sidebar-hover)' : 'transparent',
              fontWeight: location.pathname === link.path ? '600' : '400',
              borderLeft: location.pathname === link.path ? '4px solid var(--primary-color)' : '4px solid transparent',
              textDecoration: 'none'
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
      
      <div style={{ padding: '1rem' }}>
        <button 
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'transparent',
            color: 'var(--text-light)',
            padding: '1rem',
            width: '100%',
            textAlign: 'left',
            borderRadius: '0.5rem'
          }}
        >
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            N
          </div>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
