import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Upload, 
  MessageSquare, 
  Info, 
  Settings, 
  HelpCircle,
  FileText,
  BarChart3,
  Users,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navigation({ variant = 'header' }) {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const mainNavItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Home,
      description: 'Welcome page and overview'
    },
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: Upload,
      description: 'Upload and analyze documents'
    },
    { 
      path: '/about', 
      label: 'About', 
      icon: Info,
      description: 'Learn about Finesse'
    },
    { 
      path: '/contact', 
      label: 'Contact', 
      icon: MessageSquare,
      description: 'Get in touch with us'
    }
  ];

  const dashboardNavItems = [
    {
      label: 'Upload',
      icon: Upload,
      path: '/dashboard#upload',
      description: 'Upload new documents'
    },
    {
      label: 'AI Chat',
      icon: MessageSquare,
      path: '/dashboard#ai-chat',
      description: 'Chat with your documents'
    },
    {
      label: 'Search',
      icon: FileText,
      path: '/dashboard#search',
      description: 'Advanced semantic search'
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/dashboard#analytics',
      description: 'Document insights'
    }
  ];

  const resourcesDropdown = [
    {
      label: 'Documentation',
      icon: FileText,
      href: '#docs',
      description: 'API docs and guides'
    },
    {
      label: 'Help Center',
      icon: HelpCircle,
      href: '#help',
      description: 'Get support and answers'
    },
    {
      label: 'Community',
      icon: Users,
      href: '#community',
      description: 'Join our community'
    },
    {
      label: 'GitHub',
      icon: ExternalLink,
      href: 'https://github.com/pragy10/finesse',
      external: true,
      description: 'View source code'
    }
  ];

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  if (variant === 'sidebar') {
    return (
      <nav className="sidebar-navigation">
        <div className="nav-section">
          <div className="nav-section-title">Main</div>
          <ul className="nav-list">
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-item ${isActivePath(item.path) ? 'active' : ''}`}
                >
                  <item.icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {location.pathname.includes('/dashboard') && (
          <div className="nav-section">
            <div className="nav-section-title">Dashboard</div>
            <ul className="nav-list">
              {dashboardNavItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.path}
                    className="nav-item"
                  >
                    <item.icon className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="nav-section">
          <div className="nav-section-title">Resources</div>
          <ul className="nav-list">
            {resourcesDropdown.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="nav-item"
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  <item.icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {item.external && <ExternalLink className="external-icon" />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }

  if (variant === 'breadcrumb') {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Home', path: '/' },
      ...pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        return { label, path };
      })
    ];

    return (
      <nav className="breadcrumb-navigation">
        <ol className="breadcrumb-list">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="breadcrumb-item">
              {index < breadcrumbs.length - 1 ? (
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.label}
                </Link>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="breadcrumb-separator">/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  return (
    <nav className="header-navigation">
      <ul className="nav-list">
        {mainNavItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-item ${isActivePath(item.path) ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
        
        {/* Resources Dropdown */}
        <li className="nav-dropdown-container">
          <button
            className={`nav-item dropdown-trigger ${activeDropdown === 'resources' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdown(activeDropdown === 'resources' ? null : 'resources');
            }}
          >
            <HelpCircle className="nav-icon" />
            <span className="nav-label">Resources</span>
            <ChevronDown className="dropdown-arrow" />
          </button>

          <AnimatePresence>
            {activeDropdown === 'resources' && (
              <motion.div
                className="nav-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ul className="dropdown-list">
                  {resourcesDropdown.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="dropdown-item"
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                      >
                        <div className="dropdown-item-content">
                          <div className="dropdown-item-header">
                            <item.icon className="dropdown-item-icon" />
                            <span className="dropdown-item-label">{item.label}</span>
                            {item.external && <ExternalLink className="external-icon" />}
                          </div>
                          <div className="dropdown-item-description">
                            {item.description}
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
