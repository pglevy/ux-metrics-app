import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Sidebar Navigation Component
 *
 * Fixed sidebar navigation with icon-based menu items.
 * Highlights the active route and provides quick access to all main sections.
 */

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Home',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 7L10 3L17 7V17H3V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      path: '/studies',
      label: 'Studies',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="4" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      path: '/people',
      label: 'People',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M4 17C4 13.5 6.5 12 10 12C13.5 12 16 13.5 16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      path: '/metrics',
      label: 'Metrics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 14L7 10L11 13L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="3" cy="14" r="1.5" fill="currentColor"/>
          <circle cx="7" cy="10" r="1.5" fill="currentColor"/>
          <circle cx="11" cy="13" r="1.5" fill="currentColor"/>
          <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
        </svg>
      )
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="4" y="3" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="7" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="7" y1="13" x2="10" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    }
  ]

  const settingsItem: NavItem = {
    path: '/settings',
    label: 'Settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.5 4.5L14 6M6 14L4.5 15.5M15.5 15.5L14 14M6 6L4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  }

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="10" height="10" rx="2" fill="currentColor" opacity="0.3"/>
            <rect x="18" y="4" width="10" height="10" rx="2" fill="currentColor" opacity="0.6"/>
            <rect x="4" y="18" width="10" height="10" rx="2" fill="currentColor" opacity="0.6"/>
            <rect x="18" y="18" width="10" height="10" rx="2" fill="currentColor"/>
          </svg>
          <span className="logo-text">UX Metrics</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="nav-menu">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          onClick={() => navigate(settingsItem.path)}
          className={`nav-item ${isActive(settingsItem.path) ? 'active' : ''}`}
        >
          {settingsItem.icon}
          <span>{settingsItem.label}</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: var(--sidebar-width);
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          z-index: 100;
          animation: slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sidebar-header {
          padding: 28px 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-primary);
        }

        .logo svg {
          color: #2322F0;
        }

        .logo-text {
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .nav-menu {
          flex: 1;
          padding: 12px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          transition: all var(--transition-fast);
          margin-bottom: 2px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
        }

        .nav-item:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: #F5F5FC;
          color: #152B99;
        }

        .nav-item svg {
          flex-shrink: 0;
        }

        .sidebar-footer {
          padding: 12px;
          border-top: 1px solid var(--border-color);
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </aside>
  )
}
