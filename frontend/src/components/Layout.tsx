import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1>Google Sheets Dashboard</h1>
          <nav className="navigation">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Dashboard
            </Link>
            <Link 
              to="/sheets" 
              className={location.pathname === '/sheets' ? 'nav-link active' : 'nav-link'}
            >
              Sheets
            </Link>
            <Link 
              to="/metadata" 
              className={location.pathname === '/metadata' ? 'nav-link active' : 'nav-link'}
            >
              Metadata
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>
      
      <footer className="footer">
        <p>Google Sheets REST API Dashboard</p>
      </footer>
    </div>
  );
};

export default Layout;