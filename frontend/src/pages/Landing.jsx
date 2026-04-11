import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 3rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          💼 CrewUp
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" style={{ fontWeight: '500' }}>Log In</Link>
          <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
        </div>
      </nav>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3.5rem', color: 'var(--primary-color)', marginBottom: '1rem', maxWidth: '800px', lineHeight: '1.2' }}>
          Build Your Dream Team, Instantly.
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          CrewUp is where students, professionals, and campus organizations connect. Post your project, find skilled collaborators, and bring your ideas to life.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/register" className="btn-primary" style={{ fontSize: '1.1rem' }}>Get Started</Link>
          <Link to="/login" className="btn-secondary" style={{ fontSize: '1.1rem' }}>Explore Opportunities</Link>
        </div>
      </main>
    </div>
  );
};

export default Landing;
